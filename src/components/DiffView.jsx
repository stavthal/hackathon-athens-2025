import { useEffect, useRef } from "react";
import { Diff2HtmlUI } from "diff2html/lib/ui/js/diff2html-ui";
import "diff2html/bundles/css/diff2html.min.css";

export function DiffView({ diff }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && diff) {
      const diffUi = new Diff2HtmlUI(containerRef.current, diff, {
        drawFileList: true,
        matching: "lines",
      });

      diffUi.draw();
      diffUi.highlightCode();
    }
  }, [diff]);

  return (
    <div
      ref={containerRef}
      className="diff2html-wrapper rounded-md overflow-x-auto"
    />
  );
}
