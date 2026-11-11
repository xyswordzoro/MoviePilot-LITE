const ACE_EDITOR_PADDING = 12;
const ACE_EDITOR_SCROLL_MARGIN = { bottom: 8, left: 0, right: 0, top: 8 };
function configureAceEditorPadding(editor) {
  editor.renderer.setPadding(ACE_EDITOR_PADDING);
  editor.renderer.setScrollMargin(
    ACE_EDITOR_SCROLL_MARGIN.top,
    ACE_EDITOR_SCROLL_MARGIN.bottom,
    ACE_EDITOR_SCROLL_MARGIN.left,
    ACE_EDITOR_SCROLL_MARGIN.right
  );
}

export { configureAceEditorPadding as c };
