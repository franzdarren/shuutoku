/* ============================================================
   CORE — namespace + shared helpers
   Loaded before every data file. Every data file hangs its
   content off the global N4 object; index.html reads from it.
   ============================================================ */
var N4 = {};

/* Furigana helper: R("漢字","かんじ") -> <ruby> markup.
   Available to every data file so example sentences can carry
   readings that the sidebar Furigana switch can hide. */
function R(k, r){ return '<ruby>' + k + '<rt>' + r + '</rt></ruby>'; }
