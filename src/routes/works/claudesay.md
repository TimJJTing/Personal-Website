---
layout: _
title: Claudesay
description: A Claude Code plugin that renders conversational replies as ASCII character speech bubbles in the terminal
year: 2026
categories:
  - ai
  - claudecode
  - asciiart
  - shell
published: true
thumbnail: /uploads/claudesay-thumbnail.png
images:
  - image: /uploads/claudesay-demo.png
    caption: Fig. 1 - Demo
additionalLinks:
  - url: https://github.com/TimJJTing/Claudesay
    title: GitHub
---


```
  ╭─────────────────────────────────────╮
  │ Found the bug — off-by-one in the   │
  │ loop bounds. Fixed the condition.   │
  ╰───────┬─────────────────────────────╯
          │

       /\\__/\\
      ( ^▾^  )
  🔍○═: ,,,, :╮╮
      (      ) ○
      (╭....╮)
     (_)    (_)╰~~>
```

If you've spent time in a terminal, you've probably run `cowsay` at least once — the old Unix utility that prints a message inside a speech bubble with a cow underneath. It does nothing useful. That's the point.

`claudesay` is cut from the same cloth. It's a plugin for Claude Code that gives the AI assistant a small ASCII cat that reacts to whatever Claude is doing. When Claude edits a file, the cat holds a wrench. When it searches for something, the cat holds a magnifying glass. When Claude finishes a reply and has something to say, it shows up in a speech bubble underneath.

## Features

- ASCII cat that reacts to Claude's actions
- Speech bubbles for Claude's replies
- Customizable cat and speech bubbles
- Different cat expressions for different moods
- Tools held by the cat depending on the action
- Customizable tool display

## Built on Hooks

The interesting part is how it's built. Claude Code exposes a hook system — shell scripts that run at specific points in Claude's lifecycle. `claudesay` uses four of them:

- `SessionStart` injects a short instruction telling Claude to end conversational replies with a `<claudesay>` tag containing a mood and a summary.
- `UserPromptSubmit` intercepts toggle commands ("turn on claudesay") before Claude ever sees them, flipping a flag file directly.
- `PreToolUse` fires before each tool call, reads the tool name, picks an emoji prop, and renders the character to the terminal.
- `Stop` reads the last `<claudesay>` tag from Claude's reply and renders the speech bubble.

All rendering is plain Bash. No server, no background process, no external dependencies beyond jq. The ASCII art never enters Claude's context — it's written to the terminal as a transient system message, invisible to the model.

## Small Token Cost

Because `claudesay` injects a session-start instruction and a short per-turn reminder, it does add tokens. The overhead is about 120 tokens at session start plus 20 tokens per turn — well under 1% of a typical conversation. The rendered art itself costs nothing; it lives entirely in shell-land.

## Moods

The mood in each bubble isn't fixed. Claude picks from a small set — happy, excited, thinking, focused, upset, error — based on what just happened. A successful edit gets a different face than a warning. The happy/excited moods alternate to add some variety.

## Why?

Just for fun. It doesn't make Claude smarter. It doesn't save time. It's a cowsay for 2026 — a small piece of personality sitting on top of something you'd be using anyway. The terminal is a pretty sterile place. A cat with a wrench is a small improvement.

The project is on GitHub at [TimJJTing/claudesay](https://github.com/TimJJTing/claudesay).
