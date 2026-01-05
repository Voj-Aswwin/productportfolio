GSAP revolves around a single **gsap** object that creates and controls Tweens and Timelines, which together power almost every animation you will build for your portfolio site.[1]

Below is a GSAP v3 cheatsheet tailored for LLM/Cursor agents so they can implement animations on your site without re-reading the docs.[1]

***

## Core mental model

- **Tween**: animates properties of targets over time; think of it as a high-performance property setter that interpolates from a start to an end value.[1]
- **Timeline**: container that orders multiple tweens in time, lets you build complex sequences and then control the entire group as a single animation.[1]
- Every Tween/Timeline is an **Animation** instance, inheriting shared control methods like `play()`, `pause()`, `reverse()`, `timeScale()`, etc.[1]

***

## Tween creation & basics

### Main factory methods

- `gsap.to(targets, vars)`  
  - Animate from current values to values in `vars` (e.g. `{ x: 100, duration: 1 }`).[1]
- `gsap.from(targets, vars)`  
  - Animate from the values in `vars` to current values (good for entrance animations).[1]
- `gsap.fromTo(targets, fromVars, toVars)`  
  - Explicitly set both start and end values.[1]

### Typical vars for portfolio UI

- `duration`: seconds for the tween, e.g. `duration: 0.8`.[1]
- Transform shortcuts: `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY`, `skewX`, `skewY`.[1]
- Opacity and colors: `opacity`, CSS props like `backgroundColor`, `color`.[1]
- Positioning helpers: `xPercent`, `yPercent` for percentage-based transforms.[1]
- Special props:  
  - `delay`: start offset in seconds relative to now.[1]
  - `ease`: easing string like `"power3.out"`, `"back.inOut(1.7)"`.[1]
  - `repeat`: number of repeats; `-1` for infinite.[1]
  - `yoyo`: `true` for back-and-forth motion when repeating.[1]

### Example (basic card animation)

```js
gsap.to(".card", {
  duration: 0.8,
  y: -20,
  opacity: 1,
  ease: "power3.out"
});
```


***

## Timelines & sequencing

### Creating timelines

- `const tl = gsap.timeline(options?)` creates an empty Timeline.[1]
- Add tweens using instance methods (recommended): `tl.to()`, `tl.from()`, `tl.fromTo()`.[1]

```js
const tl = gsap.timeline();
tl.to(".hero-title", { y: 0, opacity: 1, duration: 0.8 })
  .to(".hero-subtitle", { y: 0, opacity: 1, duration: 0.6 })
  .to(".hero-cta", { y: 0, opacity: 1, duration: 0.6 });
```


### Default sequencing behavior

- When no position is given, tweens are added **one-after-another** in sequence.[1]

### Position parameter (absolute & relative)

- Signature: `tl.to(targets, vars, position?)`.[1]
- Numbers: absolute time in seconds from timeline start: `0`, `0.5`, `3`, etc.[1]
- Relative strings:  
  - `"+=2"`: 2 seconds after the current end of the timeline.[1]
  - `"-=1.5"`: 1.5 seconds before current end, i.e., overlaps.[1]

```js
tl.to("#green", { duration: 1, x: 404 }, 0.5)       // absolute 0.5s
  .to("#blue",  { duration: 1, x: 404 }, "-=0.75") // overlap
  .to("#orange",{ duration: 1, x: 404 }, "+=1");   // gap
```


### Labels

- Add named positions inside a timeline:
  - `tl.add("intro", "+=1")` to place a label 1s after the end.[1]
  - Use label in position: `"intro"`, `"intro+=0.5"`, etc.[1]
- Jump to label with `tl.seek("intro")`.[1]

```js
const tl = gsap.timeline();
tl.to("#green", { duration: 1, x: 404 })
  .add("blueSpin", "+=1")
  .to("#blue",   { duration: 1, x: 404, rotation: 360 }, "blueSpin")
  .to("#orange", { duration: 1, x: 404, rotation: 360 }, "blueSpin+=0.5");
```


***

## Controlling animations at runtime

### Shared control methods (Tween & Timeline)

Available instance methods (subset most relevant for agents):[1]

- `play()`: start/resume forward playback from current position.[1]
- `pause()`: stop playback at current position.[1]
- `reverse()`: play backward from current position.[1]
- `restart(includeDelay?)`: jump to start and play.[1]
- `progress(value?)`: get/set normalized progress (0–1).[1]
- `time(value?)`: get/set raw time in seconds.[1]
- `duration(value?)`: get/set total duration.[1]
- `timeScale(value?)`: playback speed (2 = double speed, 0.5 = half).[1]
- `seek(timeOrLabel)`: jump to specific time or label.[1]
- `kill()`: stop animation and remove it.[1]

### Example (hero timeline controls)

```js
const heroTl = gsap.timeline({ paused: true });
// ... add tweens
document.querySelector(".play-btn").addEventListener("click", () => heroTl.play());
document.querySelector(".back-btn").addEventListener("click", () => heroTl.reverse());
```


***

## Global GSAP object: key methods

These are entry points Cursor agents will use a lot.[1]

### Configuration & defaults

- `gsap.config(options)`  
  - Framework-level config: e.g. `nullTargetWarn`, `trialWarn`, etc.[1]
- `gsap.defaults(vars)`  
  - Set default properties for all tweens created via core methods (`gsap.to` etc.).[1]

```js
gsap.defaults({
  duration: 0.6,
  ease: "power2.out"
});
```


### Getters & utilities for live control

- `gsap.getProperty(target, property)`  
  - Read current value of an animatable property.[1]
- `gsap.getTweensOf(targets)`  
  - Get array of tweens affecting given targets.[1]
- `gsap.isTweening(targets)`  
  - Boolean: whether any tween is currently affecting target.[1]
- `gsap.killTweensOf(targets, vars?)`  
  - Kill tweens of targets; optionally limit to specific properties.[1]

### Quick performance helpers

- `gsap.quickSetter(targets, property, unit?)`  
  - Returns a function to rapidly set a property; ideal for pointer/mousemove-driven effects.[1]
- `gsap.quickTo(targets, property, vars)`  
  - Returns a function that smoothly animates a property to a value (perfect for cursor-followers, drag, etc.).[1]

```js
const xTo = gsap.quickTo(".cursor-dot", "x", { duration: 0.2, ease: "power3" });
window.addEventListener("mousemove", (e) => xTo(e.clientX));
```


### Timelines, delayed calls, root

- `gsap.timeline(vars?)`: create a new Timeline.[1]
- `gsap.delayedCall(delay, callback, params?, scope?)`: run a callback later.[1]
- `gsap.globalTimeline`: root timeline that contains all animations by default.[1]
- `gsap.updateRoot(time)` (advanced): manually advance the root timeline (custom ticks).[1]

***

## Context & matchMedia (for React/SPA/responsive)

These give agents a clean way to scope and clean up animations.[1]

- `gsap.context(callback, scope?)`  
  - Runs `callback` with a special context; calling `ctx.revert()` later cleans up all created animations.[1]
- `gsap.matchMedia()`  
  - Responsive animations based on media queries; each condition gets its own context.[1]
- `gsap.matchMediaRefresh()`  
  - Forces a refresh of matchMedia-related layouts (e.g., after dynamic DOM changes).[1]

***

## Easing fundamentals

While the full easing docs are separate, basics are useful for agents:[1]

- Built-in ease names: `"none"`, `"linear"`, `"power1.in"`, `"power1.out"`, `"power2.inOut"`, `"back.out(1.7)"`, `"elastic.out(1, 0.3)"`, etc.[1]
- Use in vars: `ease: "power3.out"` or `ease: "expo.inOut"` for polished portfolio animations.[1]
- Custom easing: `gsap.registerEase(name, easeFunctionOrConfig)` to define new eases.[1]

***

## Utility & helper methods (high-level)

GSAP exposes a `gsap.utils` object with many helpers; agents should know it exists even if not using the full list in this cheatsheet.[1]

- Typical uses for portfolio:
  - Mapping ranges, wrapping indexes, snapping positions, randomizing values, etc.[1]
- Access via: `gsap.utils.methodName(...)`.[1]

(For full API, agents can reference the `UtilityMethods` section, but most simple site animations will not need deeper details.)[1]

***

## Plugin ecosystem (what agents can assume)

GSAP core handles transforms, opacity, and most CSS properties out of the box.[1]
Plugins extend this for specialized animations; examples relevant for portfolio sites:[1]

- Scroll-related:
  - `ScrollTrigger`: ties animations to scroll position (e.g. scroll-based reveals, pinned sections).[1]
  - `ScrollSmoother`: smooth scrolling, parallax effects.[1]
  - `ScrollToPlugin`: animate scroll positions (e.g., smooth navigation to sections).[1]
- Text:
  - `SplitText`: break text into chars/words/lines for fancy typography reveals.[1]
  - `TextPlugin`: typewriter / text replacement without managing innerHTML manually.[1]
- SVG/UI:
  - `DrawSVGPlugin`, `MorphSVGPlugin`, `MotionPathPlugin`: animating SVG strokes, morphs, and paths.[1]
  - `Flip`: state-flip transitions between layouts (e.g., grid-to-detail views).[1]
  - `Draggable`, `InertiaPlugin`, `Observer`: draggable UI, physics, and interaction-based triggers.[1]

Agents should **explicitly note plugin requirements** in code comments (e.g., `"Requires ScrollTrigger plugin"`), so bundler/import setup can be handled separately.[1]

***

## Standard pattern for a GSAP-powered section

Agents can use this as a template for each animated section of the portfolio site:

```js
// 1. Create a timeline for the section (optionally paused)
const sectionTl = gsap.timeline({
  defaults: { duration: 0.7, ease: "power3.out" }
});

// 2. Add entrance animations in sequence
sectionTl
  .from(".section-title", { y: 40, opacity: 0 })
  .from(".section-subtitle", { y: 30, opacity: 0 }, "-=0.4")
  .from(".section-item", {
    y: 30,
    opacity: 0,
    stagger: 0.1
  }, "-=0.3");

// 3. Optionally connect to scroll or interactions using plugins
// Example: ScrollTrigger (if plugin is available)
ScrollTrigger.create({
  animation: sectionTl,
  trigger: ".section",
  start: "top 80%",
  toggleActions: "play none none reverse"
});
```


***


[1](https://gsap.com/docs/v3/GSAP/)