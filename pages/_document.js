import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <script dangerouslySetInnerHTML={{__html: 'if (typeof window.self === "undefined") { window.self = window; }'}}></script>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
