import { useState } from "react";
import {
  grammarModules, kanjiFocus, kanjiQuiz, readingPassages, kaiwaScenarios,
  countGrammarPoints, countPhrases, countQuizPool,
} from "../../data/index.js";

function OverviewCard({ mk, title, size, children }) {
  return (
    <div className={"ovcard ovcard--" + size}>
      <div className="ovtitle">
        <span className="ovmk">{mk}</span>
        <span className="ovname">{title}</span>
      </div>
      <p>{children}</p>
    </div>
  );
}

export default function Overview() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="section-head section-head--lead">
        <h1>Your N4 Review Handbook</h1>
        <p>You have already been through the whole N4 syllabus — Minna no Nihongo up to Lesson 47, grammar, kanji, all of it. A 65% mock score at this stage almost never means "I don't know N4." It usually means a handful of specific points are shaky (the four conditionals, passive vs. causative, the そう family) and that speaking hasn't caught up with reading. This handbook is built to fix both: a precision grammar review with sources cross-referenced to Minna no Nihongo, Genki, and Sou Matome, the complete N4 kanji list with readings and compounds, reading practice in exam style, and a dedicated Kaiwa Lab for the conversation side.</p>
      </div>

      <div className="ovgrid">
        <OverviewCard mk="文法" title="Grammar Deep-Dive" size="lg">
          {countGrammarPoints()} grammar points across {grammarModules.length} modules — the four conditionals, passive/causative, giving &amp; receiving, hearsay &amp; appearance, and a round of extra N4 essentials. Grouped into tabs so you can work through one module at a time instead of one long scroll.
        </OverviewCard>
        <OverviewCard mk="漢字" title="Kanji Focus" size="sm">
          All {kanjiFocus.length} N4 characters — both readings, core meaning, a common compound, plus a {kanjiQuiz.length}-question reading check.
        </OverviewCard>
        <OverviewCard mk="読解" title="Reading Lab" size="half">
          {readingPassages.length} short passages in JLPT reading style — diary entries, notices, and emails — each with comprehension questions. Highlight any word to look it up instantly.
        </OverviewCard>
        <OverviewCard mk="会話" title="Kaiwa Lab" size="half">
          {kaiwaScenarios.length} trip and daily-life scenarios with their key phrases pulled out, a {countPhrases()}-phrase bank grouped by situation, and role-play notes for both sides.
        </OverviewCard>
        <OverviewCard mk="力" title="Quiz Center" size="full">
          A mixed mock-test style review pulling grammar, kanji, reading and conversation together — {countQuizPool()} questions in the pool, 10 drawn at random each visit — plus your running score across the whole handbook.
        </OverviewCard>
      </div>

      <p className="ovnote"><b>設定 — Settings</b> live in the sidebar and stay available everywhere: furigana on/off, dark mode, and text size.</p>

      <button className={"collapsible-head" + (open ? " open" : "")} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="tri">▸</span> How to actually use this before your mocks
      </button>
      <div className={"collapsible-body" + (open ? " open" : "")}>
        <div className="gcard" style={{ "--accent": "var(--gold)" }}>
          <div className="explain" style={{ marginBottom: 0 }}>
            <b>1. Diagnose first.</b> Skim the Grammar Deep-Dive module titles below. The ones where you hesitate even reading the title (not the explanation) are your real gaps — start there, not from the top.<br /><br />
            <b>2. Read the nuance, not just the formation.</b> Most N4 mock-test mistakes come from mixing up two similar patterns (たら vs ば, そう vs よう, てもいい vs なくてもいい) rather than not knowing either one exists. The explanation text calls these confusions out directly.<br /><br />
            <b>3. Say the dialogues out loud.</b> Reading a dialogue silently trains recognition; reading it out loud, then covering the Japanese and reconstructing it from the English, trains production — which is the actual kaiwa muscle.<br /><br />
            <b>4. Do the quizzes cold, then again after review.</b> If you get a quiz question right the first time, that point is probably fine for the mock exam. If you get it wrong, that is exam-week priority material.
          </div>
        </div>
      </div>
    </>
  );
}
