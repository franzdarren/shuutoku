/** Renders pre-built Japanese HTML (with <ruby> furigana) and marks the
 *  element as a highlight-to-look-up zone for the vocab tooltip. */
export default function JpText({ html, tag = "span", className = "", ...rest }) {
  const Tag = tag;
  return <Tag className={("jp-lookup " + className).trim()} dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
}
