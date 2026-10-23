# ASTRA — Coastal Rush · v1.1 · Mobile

Complete browser game source, ready for GitHub Pages. No build step or runtime asset downloads.

## Upload the game to GitHub

1. Download and extract this ZIP.
2. Create a repository on GitHub. Use a private repository if you want the source to stay private.
3. Use Add file → Upload files. Upload all the extracted files and the vendor folder, preserving the folder structure.
4. Confirm index.html is directly in the repository root, alongside game.js, physics.js, world.js and style.css. Do not upload only the ZIP.

## Optional: host with GitHub Pages

GitHub Pages sites can be publicly accessible even when their repository is private. If privacy is required, confirm your GitHub plan and organization support private Pages access before enabling it. Uploading these files alone does not enable Pages.

When you choose to publish:
1. Open repository Settings → Pages.
2. Under Build and deployment, select Deploy from a branch.
3. Select main and / (root), then Save.
4. Wait for the deployment to finish and open the URL shown on the Pages settings page.

If the hidden .nojekyll file is not included by your upload, the ordinary static files in this package should still work. You may add an empty .nojekyll file at the repository root.

Official instructions:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Play

Use a current desktop or phone browser with WebGL 2 and hardware acceleration. Landscape is recommended on a phone. Click Start your run or press Enter. Cross all 12 gates in order and complete two laps. Gold target: 2:20. Silver: 2:50. Bronze: 3:30. Personal best times are stored in the browser.

W / Up: accelerate
S / Down: brake; continue holding at rest to reverse
A / Left: steer left
D / Right: steer right
Space: handbrake
Shift: nitro (regenerates when released)
C: cycle chase, hood and wide chase cameras
B: hold to look behind
F: recover to last valid checkpoint (+3 s)
R: restart the entire event
Escape: pause / resume and settings
M: toggle engine sound

The game pauses when focus is lost. Balanced graphics caps resolution. Performance disables dynamic shadows.

## Touchscreen controls

Phone controls appear automatically; the pause settings also let you turn Touch Controls on manually.

Hold ◀ or ▶ with your left thumb to steer. Hold GAS with your right thumb to accelerate. BRAKE slows the car and continues into reverse. Hold NITRO for boost or DRIFT for the handbrake; simultaneous inputs are supported. CAM switches camera. RESET recovers to the last checkpoint with a +3 s penalty. Tap the pause icon for settings or to restart. Fullscreen is offered when supported by the browser.

Both portrait and landscape layouts are supported. Phone graphics default to Performance: shadows and multisample antialiasing off, capped rendering resolution and adaptive resolution under sustained load.

Version 1.1 corrects the A/D and arrow-key steering signs in physics and wheel animation. Screen-space tests verify the turn direction from the actual chase camera coordinate system. The route arrows were corrected to match.

## Run locally

Serve this extracted folder using any static web server. With Python installed:

    python -m http.server 8000

Then open http://localhost:8000 . Double-clicking index.html is unsupported because JavaScript modules need an HTTP server. No npm installation is needed to play or host.

## Files

index.html — full-screen game UI
style.css — responsive HUD and menus
game.js — controls, cameras, audio, HUD and game lifecycle
physics.js — deterministic driving, track and race logic
touch-input.js — simultaneous captured pointer controls and cancellation cleanup
world.js — procedural car, scenery, effects and lighting
vendor/three.module.js — bundled Three.js r170
vendor/THREE-LICENSE.txt — required Three.js MIT license
icon.svg — game icon
.nojekyll — disables Jekyll processing on GitHub Pages

This is an original single-player arcade time attack prototype, not an NFS or Forza product. Physics, camera-projected A/D direction, multi-touch release/cancellation and production control-flow tests passed, including two complete laps. The phone HUD was inspected in the browser at 844×390 landscape and 390×844 portrait. Actual phone GPU performance remains unverified. Browser GPU rendering could not be visually verified because the available test browser disables WebGL.
