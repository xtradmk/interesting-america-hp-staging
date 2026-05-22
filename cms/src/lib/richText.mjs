import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

export async function lexicalToHTML(editorState) {
  if (!editorState?.root) {
    return ''
  }

  return convertLexicalToHTML({
    data: editorState,
  })
}

