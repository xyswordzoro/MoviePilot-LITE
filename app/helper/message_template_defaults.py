"""MoviePilot-LITE 内置通知模板。"""
import json

# 下载开始通知：紧凑摘要 + Telegram 可折叠详情。
# 普通渠道使用 text，Telegram 优先使用 html（大图 + 折叠引用）。
DOWNLOAD_ADDED_TEMPLATE = json.dumps(
    {
        "title": "{{ title_year }}"
        "{% if download_episodes %} · {{ season_fmt }}{{ download_episodes }}"
        "{% elif season_episode %} · {{ season_episode }}"
        "{% endif %} 开始下载",
        "text": "{% if releaseGroup %}{{ releaseGroup|trim }}{% endif %}"
        "{% if resource_term %}{% if releaseGroup %} · {% endif %}{{ resource_term|trim }}{% endif %}"
        "{% if size %}{% if releaseGroup or resource_term %} · {% endif %}{{ size|trim }}{% endif %}"
        "\n{% if site_name %}🌐 {{ site_name|trim }}{% endif %}"
        "{% if seeders %}   🌱 {{ seeders }} 做种{% endif %}"
        "{% if volume_factor %}   ⚡ {{ volume_factor|trim }}{% endif %}"
        "\n\n{% if pubdate %}🕒 {{ pubdate|trim }}{% endif %}"
        "{% if username %}{% if pubdate %} · {% endif %}👤 {{ username }}{% endif %}"
        "{% if category %}{% if pubdate or username %} · {% endif %}🎭 {{ category }}{% endif %}"
        "{% if labels %}\n🏷 {{ labels }}{% endif %}"
        "{% if original_name %}\n📛 {{ original_name }}{% endif %}"
        "{% if description %}\n\n📝 {{ description }}{% endif %}",
        "html": "{% if releaseGroup %}{{ releaseGroup|trim|e }}{% endif %}"
        "{% if resource_term %}{% if releaseGroup %} · {% endif %}{{ resource_term|trim|e }}{% endif %}"
        "{% if size %}{% if releaseGroup or resource_term %} · {% endif %}{{ size|trim|e }}{% endif %}"
        "\n{% if seeders %}🌱 <b>{{ seeders }}</b> 做种{% endif %}"
        "{% if volume_factor %}   ⚡ <b>{{ volume_factor|trim|e }}</b>{% endif %}"
        "{% if site_name %}   🌐 {{ site_name|trim|e }}{% endif %}"
        "\n<blockquote expandable>"
        "{% if pubdate %}🕒 {{ pubdate|trim|e }}{% endif %}"
        "{% if username %}{% if pubdate %} · {% endif %}👤 {{ username|e }}{% endif %}"
        "{% if category %}{% if pubdate or username %} · {% endif %}🎭 {{ category|e }}{% endif %}"
        "{% if labels %}\n🏷 {{ labels|e }}{% endif %}"
        "{% if original_name %}\n📛 {{ original_name|e }}{% endif %}"
        "{% if description %}\n\n📝 {{ description|e }}{% endif %}"
        "</blockquote>",
    },
    ensure_ascii=False,
)

# 旧版下载通知模板标记，用于首次升级时替换为 LITE 新版格式。
LEGACY_DOWNLOAD_ADDED_MARKERS = ("👾 用户", "🕒 时间", "站点：")
