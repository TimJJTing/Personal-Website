---
layout: _
title: React Untersuchungen
description: A Philosophical Investigations into a Framework
date: 2026-04-11
categories:
  - react
  - wittgenstein
  - philosophy
published: true
thumbnail: /uploads/ouroboros.png
---

## Preface

As a software engineer who has spent a decent amount of time on React over the past few years, I sometimes find myself doubting its philosophy and technical decisions, wondering if **it is actually solving problems or creating them**. It turned out that I am not alone. After watching Rich Harris's famous talk "Rethinking Reactivity"[^1], I switched to SvelteKit whenever possible and have lived a happier life since, although I still have to write React sometimes as it is practically everywhere.

I remember once mentioning this to a frontend developer, and we instantly fell into a debate: **is React constantly creating its own problems, or is it genuinely solving the issues it initially set out to address in frontend engineering?** I cannot recall how that debate ended, but the question has stayed with me ever since. Until recently, when I came across Ludwig Wittgenstein and his work, I thought it would be interesting to use his lens to examine React and finally try to answer that question. Therefore, I wrote this short essay.

This essay attempts to examine React and Next.js with more honesty than is typical in developer writing, which tends to gravitate toward either advocacy or complaint. The aim here is neither. It is the kind of examination that Wittgenstein called _Untersuchungen_: patient investigation not into what a thing _should_ be, but into what it actually is and what it does in practice.

Wittgenstein's _Philosophische Untersuchungen_ (_Philosophical Investigations_)[^2] proceeds not through grand theory but through careful attention to how language actually functions in use. He did not build systems; he dissolved confusions. That method seems appropriate for React, a framework that has generated a remarkable volume of confident opinions relative to its source code. What follows is an attempt to be less confident and more precise.

---

## I. Origins: The Problem React Set Out to Solve

### The Badge Bug

React emerged from Facebook in 2013[^3], but its origins lie in a specific and rather mundane failure: the notification badge displaying the wrong number. A user would see "3 unread messages" while the message list showed five. The counter and the list had diverged, and the Document Object Model (DOM) was presenting information that no longer matched the application state.

This was far from an isolated or exotic problem. By 2011–2013, web applications had grown significantly more interactive, and the jQuery era had succeeded in making DOM manipulation tractable[^4]. However, it had not resolved the underlying challenge of keeping complex interfaces in sync with mutable data. As applications scaled, involving more state, more events, and more components needing to reflect the same underlying data, the implicit global choreography of direct DOM mutation began to break down. Bugs became emergent, difficult to trace, and hard to prevent through convention alone.

React's answer was architecturally elegant: `UI = f(state)`. Rather than imperatively updating the DOM in response to every change, React proposed declaring what the interface should look like for a given state, and letting the framework compute the minimal operations needed to reach that state[^3]. Unidirectional data flow prevented the cascading update cycles that had been a well-known issue in Angular 1's digest loop[^5]. The Virtual DOM provided a stable declarative surface while hiding the imperative machinery beneath.

### Did React Discover a Problem, or Construct One?

This is where honest reflection becomes uncomfortable, but the question is worth pursuing.

Wittgenstein wrote that a philosophical problem has the form: "I don't know my way about" (_PI_ §123)[^2]. React's founding narrative depends on a prior confusion, namely the messiness of imperative DOM manipulation, from which it offers rescue. However, it is worth asking whether that confusion was discovered, or whether it was, at least in part, constructed by React's own framing.

Pre-React patterns were not failures by their own standards. jQuery's model was imperative and direct: find elements, manipulate them[^4]. This represented a different game entirely, with its own rules and its own fluency. When developers look back at jQuery code today and call it "spaghetti," they are seeing it through React's lens. The vocabulary that makes jQuery seem obviously insufficient, such as "tightly coupled," "impure," and "side-effectful," is React's vocabulary, applied retroactively to a world that did not use it.

This is not to deny that Facebook's badge bug was real. Real users received wrong information, and real engineers spent significant time debugging emergent state. However, there is an important distinction between identifying a specific production failure and constructing a universal theory of why all imperative UI programming is fundamentally broken. React did both, and it conflated them in the process.

Both things can be true simultaneously. React solved concrete, measurable problems while also reframing the entire field of UI development in its own terms. The market adoption that followed provides evidence of net benefit, but adoption is not the same as truth. Other frameworks, including Ember, Knockout, Angular 2, and even disciplined vanilla JavaScript, also addressed the badge bug[^6]. React should therefore be understood not as the discovery of a natural law, but as one well-designed answer to a real question.

---

## II. The Evolution of React's Capabilities

### A Decade of Architectural Shifts

React did not stand still. Over the decade following its release, it underwent transformations significant enough that a 2013 React application and a 2024 React application share little beyond their name.

**The Fiber Rewrite (2015–2017)** was the first major architectural overhaul, yet also the most invisible to end users[^7]. The original stack-based reconciler was synchronous and blocking: for large component trees, React would freeze the main thread while computing updates. Fiber replaced the call-stack metaphor with a manually managed linked list of work units, making rendering pausable and resumable. Developers saw nothing change directly, but this foundation made every subsequent capability possible.

**Hooks (2018)** were the first transformation that developers actually felt[^8]. Class components had accumulated significant ergonomic debt: lifecycle methods (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`) scattered related logic across unrelated methods, while sharing stateful logic required convoluted Higher Order Components (HOCs) or render props. Hooks (notably `useState`, `useEffect`, `useRef`, and `useContext`) allowed state and side effects to live in plain functions, with related logic colocated and reusable.

The gain was real. Logic composition became far more natural, and custom hooks are genuinely elegant. However, the costs were immediate and lasting: stale closures, dependency arrays, and the Rules of Hooks introduced a new category of bugs. Developers who had mastered class components found themselves re-learning fundamentals. The linter gained new rules. Moreover, the mental model for asynchronous effects became significantly more complex than what came before.

**Concurrent React (2018–2022)** extended Fiber's capabilities into user-facing APIs: `Suspense`, `useTransition`, and `useDeferredValue`[^9]. The vision was UI responsiveness as a first-class feature, specifically the ability to interrupt a low-priority update to handle urgent input. In principle, this represented a significant capability gain. In practice, adoption was slow, conceptual overhead was high, and the benefits were often invisible to users without specific workloads.

**Server Components (2020–present)** represent the most fundamental shift[^10]. React components, which were previously a client-side abstraction, can now run exclusively on the server, fetching data directly from databases and streaming rendered HTML to the client. Next.js, which had already established itself as React's dominant meta-framework, became React's primary delivery mechanism[^11]. At this point, React had evolved beyond a UI library into a full-stack architectural framework. The gain includes improved performance, less JavaScript shipped to the client, and no API waterfall round-trips. The cost involves a new server/client mental boundary, deep bundler coupling, and an entirely new set of rules about what can go where.

### The Pattern: Complexity Descends and Distributes

Viewed as a whole, React's evolution follows a consistent pattern: **complexity is pushed down into framework internals and out into the surrounding ecosystem**, including build tools, the Next.js layer, the linting configuration, and the TypeScript types. Each generation addresses real problems while increasing the total conceptual surface area a developer must master to work safely.

Hooks solved class component problems while introducing closure semantics. Server Components solve API waterfall problems while introducing the server/client boundary. React is more capable in 2024 than in 2013 by an order of magnitude. It is also objectively less simple.

This pattern is of course not unique to React. Database systems, cloud platforms, and build tools all accumulate sophistication over time. The more important question is whether the accumulated complexity is _essential_, reflecting genuine difficulty in the problem domain, or _accidental_, reflecting compounding architectural choices[^12]. React's evolution has been almost exclusively additive: nothing is removed, only reframed as "the old way." The class component still exists but is deprecated. The old lifecycle methods remain in the codebase but are labeled "legacy." React's history can therefore be understood as a stratigraphy of solved problems that remain embedded in the codebase as technical sediment.

---

## III. React as a Language-Game

### Wittgenstein's Concept

In the _Philosophical Investigations_, Wittgenstein introduced the concept of "language-games" (_Sprachspiele_) to describe how language functions within specific practices and forms of life[^2]. Words do not have meaning in isolation; they acquire meaning through their use in particular activities, within communities that share practices. The meaning of "game" cannot be captured by a single definition; it is held together by overlapping family resemblances rather than a common essence.

More relevant to the present discussion, Wittgenstein warned against what he called the "bewitchment of our intelligence by means of our language" (_PI_ §109)[^2]. Confusion arises when one is misled by the surface grammar of vocabulary into thinking one is describing deep facts about the world, when in reality one is following rules within a particular game. The remedy, Wittgenstein argued, is _therapy_ rather than theory: careful attention to how words are actually used, dissolving confusion rather than constructing systems that perpetuate it.

### React's Vocabulary as a Form of Life

Applying this lens to React brings something uncomfortable into focus.

React has given developers a rich vocabulary: _component_, _state_, _effect_, _render_, _reconciliation_, _hydration_, _suspense_, _fiber_, _server component_. These terms feel as though they describe fundamental realities about user interfaces. However, consider a pointed test: can these concepts be translated into neutral terms, without relying on React's own vocabulary?

Take _stale closure_ as an example. This is a genuine problem in React development, where a `useEffect` callback captures an outdated value from a previous render. However, this problem only exists within React's model of rendering and closures. It is not a problem in Angular, not a problem in Vue's options API, and not a problem in vanilla JavaScript event handlers[^6]. The same underlying behavior that causes a stale closure in React is unremarkable in other contexts. The problem exists within React's world specifically, not in the world of UI development broadly.

```tsx
// React
function Counter() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setCount(count + 1); // ❌ stale closure
		}, 1000);
		return () => clearInterval(id);
	}, []); // ❌ dependency array required

	return <h1>{count}</h1>;
}
```

```javascript
// Vanilla JS
let count = 0;

const id = setInterval(() => {
	count++; // ❌ no stale closure here
	console.log(count);
}, 1000);

// No dependency array needed
```

The same analysis applies, in varying degrees, to dependency arrays, the Rules of Hooks, hydration errors, the server/client boundary, and concurrent rendering edge cases. Each of these challenges arises specifically because React structured its model in particular ways. This is worth stating plainly: **React relocates complexity more than it eliminates it**. Pre-React complexity was emergent, implicit, global, and hard to trace. React's complexity is structured, explicit, local, and lint-enforceable. React bugs tend to fail loudly, with stack traces and linter warnings. That is a genuine advantage. However, it should be recognized as solving React's version of the problem, rather than the underlying problem itself.

The question that cannot be easily dismissed is therefore this: is this relocation progress toward some objective optimum, or is it a move within React's language-game that makes the problems of the previous game invisible while generating a new set of internal problems?

### In Defense of the Trade

This critique deserves a fair counterargument, because the strongest version of it proves too much.

All abstractions are, to some extent, self-referential. One cannot explain SQL normalization without the relational model. One cannot explain garbage collection without the concept of automatic memory management. Every abstraction creates vocabulary that must be learned before the abstraction makes sense[^13]. The fact that React's concepts require React's vocabulary is therefore not unique to React; it is a feature of all frameworks, all languages, and all tools. Every form of life generates its own problems and its own solutions. Condemning React on this basis alone would condemn all abstraction.

Furthermore, React's complexity is _structured_. When a React application fails, it tends to fail in diagnosable ways. The linter reports missing dependencies. Type errors surface at compile time. The component tree provides a clear debugging surface. This tractability is not a trivial advantage. The emergent, global chaos of large-scale jQuery applications was genuinely costly, and React's constraints made reasoning about large team codebases feasible in a way that was very difficult before.

Additionally, React's dominance over a decade, across diverse application types and organization sizes, provides circumstantial evidence that its tradeoffs served real needs. Markets are not infallible, but they are not nothing. When millions of developers find a tool productive across a sustained period, that constitutes at least some evidence that it is addressing something real.

### The Bewitchment Problem

Nonetheless, the most serious concern goes beyond whether React's tradeoffs are net-positive. It concerns what happens _after_ React becomes dominant.

When a language-game becomes hegemonic, and its vocabulary becomes the only vocabulary available, practitioners lose the ability to see outside it. By 2026, many developers entering the field have never used anything other than React. They experience jQuery as an obviously defective version of React, rather than as a different game with different rules. They perceive imperative DOM manipulation as a failure to implement React correctly, rather than as a coherent alternative model.

This is Wittgenstein's bewitchment in action. The framework has naturalized its vocabulary so thoroughly that it now appears to describe objective reality rather than making one set of choices among many. When a React developer encounters Svelte's compile-time reactivity[^14], or HTMX's server-centric hypermedia model[^15], or SolidJS's fine-grained reactivity without a Virtual DOM[^16], they often experience it as "weird" or "limited." This reaction typically arises not because these models are inferior, but because they require stepping outside the language-game that has structured all of one's intuitions.

The practical test is therefore simple: **if one cannot imagine building a UI without React, that is a signal that one is inside the language-game, not above it**. This observation does not invalidate React. It suggests, rather, that the framework should be held more lightly, as a useful tool among tools rather than a discovered truth about how interfaces must work.

---

## IV. The Future: Expanding the Game, or Escaping It?

### Signals from the Ecosystem

The current moment offers several signals worth examining. Server Components and the Next.js App Router have been widely adopted but remain sources of significant developer confusion[^11], which provides evidence of the cognitive tax that comes with blurring the server/client boundary inside a single component tree. The React team's roadmap includes React Compiler, which automates memoization to eliminate a major class of performance-related mental overhead[^17]. This is itself an acknowledgment that `useMemo`, `useCallback`, and manual dependency management were too costly to reason about correctly.

Vercel, the company behind Next.js, has become deeply entangled with React's direction, raising questions about whether React's future is shaped by Facebook's original engineering pragmatism or by Vercel's commercial interests in a full-stack deployment platform[^11]. This entanglement may not be malign, but it is worth noting. The gap between what React addresses and what Vercel's infrastructure sells is narrowing.

Meanwhile, alternatives have matured on their own terms. Svelte compiles away the framework itself, leaving almost no runtime[^14]. HTMX returns to hypermedia principles, treating the browser as a hypermedia client rather than an application runtime[^15]. SolidJS demonstrates that fine-grained reactivity can outperform the Virtual DOM while eliminating an entire class of React-specific problems[^16]. Vue has incorporated lessons from React while preserving a more accessible mental model[^18]. Each of these projects addresses many of the same underlying problems that React tackles, yet they do so through fundamentally different sets of tradeoffs. They are worth investigating not necessarily to replace React, but to restore the ability to see React from the outside.

However, intellectual honesty demands acknowledging that these alternatives are themselves language-games, subject to the same dynamic this essay has described. Svelte, for instance, is my personal favorite, yet when the Svelte team introduced runes in Svelte 5[^19] to address the limitations of the previous reactivity model, they were doing precisely what React has done repeatedly: solving problems that their own earlier design decisions had created. The `$state`, `$derived`, and `$effect` runes replaced the implicit reactivity of `let` declarations, which had proved confusing and limiting at scale. In doing so, Svelte generated its own new vocabulary, its own new learning curve, and its own new category of internal problems.

Every solution in software engineering, if examined closely enough, constitutes a language-game.

React, then, is not uniquely guilty. It is simply a larger target, and for good reason. As the de facto standard of web engineering, React's language-game carries disproportionate influence over how developers think about UI as a discipline. This influence is amplified further in the emerging era of AI-assisted development, where large language models tend to default to React when generating frontend code, reinforcing its dominance through a feedback loop that has little to do with technical merit. When AI becomes the primary author of UI code, the hegemony of a single language-game becomes a more urgent concern than it was when developers still chose their tools deliberately.

The honest question for 2026 is whether React's complexity growth, encompassing Server Components, Concurrent features, an ever-expanding vocabulary, and a build pipeline that has become a framework in its own right, is still justified by capability gains for the median application, or whether diminishing returns have been reached. The game may be becoming too costly to play for the class of problems it was originally designed to address.

### What Practitioners Should Take Away

Several conclusions can be stated with reasonable confidence.

**React solved real problems.** The badge bug was real. State synchronization in large interactive applications is genuinely hard. React's component model and unidirectional data flow provided tractable structure for a problem that was generating real costs[^3]. This can be verified as historical fact, not marketing.

**React also constructed its world.** The framing of pre-React development as inherently broken, and React as the natural successor, constitutes React's language-game rather than a neutral description. Developers who absorbed this framing may have systematically undervalued alternatives that chose different tradeoffs for legitimate reasons.

**Complexity has been relocated, not eliminated.** Modern React developers spend significant time on React-specific problems, such as stale closures, dependency arrays, hydration errors, server/client boundaries, and concurrent edge cases, that did not exist before React. These are the costs of admission to the language-game. They may be worth paying for complex interactive applications, but they should be paid consciously, not invisibly.

**Fluency is not the same as understanding.** A developer who finds React intuitive and alternatives confusing may simply be fluent in one language-game and less familiar with others, rather than seeing the landscape clearly. Genuine understanding means being able to articulate React's tradeoffs in terms that do not presuppose React: what it gives, what it costs, and where a different approach would serve better.

**The game may be expanding beyond its optimal scope.** React began as a UI library for a specific class of complex, stateful interfaces. It has since become a full-stack architectural framework. This expansion has brought capabilities, but also obligations: developers building a modest interactive page must now reason about server components, streaming, hydration, bundler configuration, and the React Compiler. The Wittgensteinian question, whether this complexity still serves the practice or has outrun it, is worth asking at every project start.

---

## Conclusion: Untersuchungen

_Untersuchungen_ means investigations: careful, patient examination that does not claim to arrive at a final theory, but aims to dissolve confusion and restore clarity about what one is actually doing when one reaches for a tool.

React is neither a discovery nor a mistake. It is a language-game, one that emerged from a specific practice, at a specific historical moment, in response to specific problems, and that shaped the problems and solutions of everything that followed. This does not make it wrong. It makes it particular rather than universal, and that distinction matters.

The tension at the heart of this essay may be irreducible: React demonstrably solved real problems, and it demonstrably constructed a self-referential world in which its own solutions define what counts as a problem. Both are true. The mature response is to hold this tension rather than resolve it by picking a side: to use React where it earns its complexity cost, to reach for alternatives where it does not, and to remain capable of telling the difference.

Wittgenstein closed the _Tractatus Logico-Philosophicus_[^20] with a line that has been extensively quoted: "Whereof one cannot speak, thereof one must be silent." He later came to think this was the wrong lesson. The later Wittgenstein advocated not silence but _attention_: to how words are actually used, to the practices that give them meaning, and to the confusions that arise when one forgets that one is playing a game.

Looking ahead, the most productive path for React practitioners may be to cultivate this same attention, rather than either abandoning the framework or defending it uncritically. What is called for is honest examination of what React does, what it costs, and what world it makes visible while making other worlds harder to see. Such examination does not threaten React. It is the condition under which React can be used well, and under which the broader field of UI development can continue to evolve beyond any single framework's assumptions.

_Jie-Ting Jiang, April 2026_

---

_P.S. For a more concise summary of the above:_

<YouTube url="https://www.youtube.com/embed/aXcuz6fn8_w" allowfullscreen />

![Fixing Problems](https://imgs.xkcd.com/comics/fixing_problems.png)
_xkcd: Fixing Problems. [https://xkcd.com/1739/](https://xkcd.com/1739/)_

[^1]: R. Harris, "Rethinking Reactivity," You Gotta Love Frontend, 2019. [Online]. Available: https://www.youtube.com/watch?v=AdNJ3fydeao

[^2]: L. Wittgenstein, _Philosophical Investigations_ (_Philosophische Untersuchungen_), G. E. M. Anscombe, Trans. Oxford: Blackwell, 1953.

[^3]: J. Walke, "React: A JavaScript library for building user interfaces," Facebook Open Source, 2013. [Online]. Available: https://legacy.reactjs.org/blog/2013/06/05/why-react.html

[^4]: J. Resig, "jQuery: The write less, do more JavaScript library," 2006. [Online]. Available: https://jquery.com

[^5]: M. Hevery, "AngularJS: Superheroic JavaScript MVW Framework," Google, 2010. [Online]. Available: https://angularjs.org

[^6]: E. You, "Vue.js: The Progressive JavaScript Framework," 2014. [Online]. Available: https://vuejs.org; T. Dale, "Ember.js: A framework for ambitious web applications," 2011. [Online]. Available: https://emberjs.com

[^7]: A. Clark, "React Fiber Architecture," 2016. [Online]. Available: https://github.com/acdlite/react-fiber-architecture

[^8]: D. Abramov, "React v16.8: The One With Hooks," React Blog, Feb. 2019. [Online]. Available: https://legacy.reactjs.org/blog/2019/02/06/react-v16.8.0.html

[^9]: React Team, "React v18.0," React Blog, Mar. 2022. [Online]. Available: https://react.dev/blog/2022/03/29/react-v18

[^10]: React Team, "Introducing Zero-Bundle-Size React Server Components," React Blog, Dec. 2020. [Online]. Available: https://react.dev/blog/2020/12/21/data-fetching-with-react-server-components

[^11]: Vercel, "Next.js: The React Framework for the Web," [Online]. Available: https://nextjs.org

[^12]: F. P. Brooks, "No Silver Bullet: Essence and Accident in Software Engineering," _Computer_, vol. 20, no. 4, pp. 10–19, Apr. 1987.

[^13]: J. Spolsky, "The Law of Leaky Abstractions," _Joel on Software_, Nov. 2002. [Online]. Available: https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/

[^14]: R. Harris, "Svelte: Cybernetically enhanced web apps," 2016. [Online]. Available: https://svelte.dev

[^15]: C. Gross, _Hypermedia Systems_. 2023. [Online]. Available: https://hypermedia.systems; HTMX: https://htmx.org

[^16]: R. Carniato, "SolidJS: Simple and performant reactivity for building user interfaces," 2018. [Online]. Available: https://www.solidjs.com

[^17]: React Team, "React Compiler," React Documentation, 2024. [Online]. Available: https://react.dev/learn/react-compiler

[^18]: E. You, "Vue 3 Composition API," Vue.js Documentation, 2020. [Online]. Available: https://vuejs.org/guide/extras/composition-api-faq.html

[^19]: Svelte Team, "Svelte 5: Runes," Svelte Blog, 2024. [Online]. Available: https://svelte.dev/blog/runes

[^20]: L. Wittgenstein, _Tractatus Logico-Philosophicus_, C. K. Ogden, Trans. London: Kegan Paul, 1922.
