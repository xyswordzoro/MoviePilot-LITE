import hashlib
import io
from pathlib import Path
from typing import Optional

from PIL import Image, ImageDraw, ImageFont

from app.core.config import settings
from app.helper.image import ImageHelper
from app.log import logger

IMAGE_WIDTH = 1280
IMAGE_HEIGHT = 720
FONT_CANDIDATES = (
    "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    r"C:\Windows\Fonts\msyh.ttc",
    r"C:\Windows\Fonts\simhei.ttf",
)


def _get_font_path() -> Optional[str]:
    for path in FONT_CANDIDATES:
        if Path(path).is_file():
            return path
    return None


def _get_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    font_path = _get_font_path()
    if not font_path:
        return ImageFont.load_default()
    return ImageFont.truetype(font_path, size, index=0)


def _fit_text(draw: ImageDraw.ImageDraw, text: str, max_width: int, max_size: int, min_size: int) -> tuple[str, ImageFont.FreeTypeFont | ImageFont.ImageFont]:
    """缩小字号并截断，保证标题不超出图片。"""
    for size in range(max_size, min_size - 1, -2):
        font = _get_font(size)
        if draw.textlength(text, font=font) <= max_width:
            return text, font

    font = _get_font(min_size)
    while text and draw.textlength(f"{text}…", font=font) > max_width:
        text = text[:-1]
    return f"{text}…" if text else "", font


def build_download_image(
    background_url: Optional[str],
    title: Optional[str],
    episode: Optional[str] = None,
) -> Optional[str]:
    """把剧集名和集数合成到背景图底部，返回本地图片路径。"""
    if not background_url or not title:
        return None

    cache_key = hashlib.md5(f"v2|{background_url}|{title}|{episode or ''}".encode()).hexdigest()
    output_dir = Path(settings.TEMP_PATH) / "notification"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{cache_key}.jpg"
    if output_path.is_file():
        return output_path.as_posix()

    content = ImageHelper().fetch_image(background_url)
    if not content:
        return None

    try:
        image = Image.open(io.BytesIO(content)).convert("RGB")
    except Exception as err:
        logger.warning(f"通知图片解析失败：{err}")
        return None

    # 按 16:9 居中裁剪
    target_ratio = IMAGE_WIDTH / IMAGE_HEIGHT
    width, height = image.size
    if width / height > target_ratio:
        new_width = int(height * target_ratio)
        left = (width - new_width) // 2
        image = image.crop((left, 0, left + new_width, height))
    else:
        new_height = int(width / target_ratio)
        top = (height - new_height) // 2
        image = image.crop((0, top, width, top + new_height))
    image = image.resize((IMAGE_WIDTH, IMAGE_HEIGHT), Image.LANCZOS)

    # 底部渐变，保证文字可读
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    start_y = int(IMAGE_HEIGHT * 0.42)
    for y in range(start_y, IMAGE_HEIGHT):
        ratio = (y - start_y) / (IMAGE_HEIGHT - start_y)
        alpha = int(220 * (ratio ** 1.35))
        overlay_draw.line([(0, y), (IMAGE_WIDTH, y)], fill=(0, 0, 0, alpha))
    image = Image.alpha_composite(image.convert("RGBA"), overlay).convert("RGB")

    draw = ImageDraw.Draw(image)
    title_text, title_font = _fit_text(draw, title, IMAGE_WIDTH - 128, 72, 42)
    draw.text(
        (64, IMAGE_HEIGHT - 220),
        title_text,
        font=title_font,
        fill=(255, 255, 255),
        stroke_width=2,
        stroke_fill=(0, 0, 0, 90),
    )

    if episode:
        episode_font = _get_font(42)
        draw.text(
            (65, IMAGE_HEIGHT - 110),
            episode,
            font=episode_font,
            fill=(245, 247, 250),
            stroke_width=1,
            stroke_fill=(0, 0, 0, 70),
        )

    image.save(output_path, "JPEG", quality=92, optimize=True)
    return output_path.as_posix()
