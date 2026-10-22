# ASTRA — Coastal Rush

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

Use a current desktop browser with WebGL 2 and hardware acceleration. Click Start your run or press Enter. Cross all 12 gates in order and complete two laps. Gold target: 2:20. Silver: 2:50. Bronze: 3:30. Personal best times are stored in the browser.

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

## Run locally

Serve this extracted folder using any static web server. With Python installed:

    python -m http.server 8000

Then open http://localhost:8000 . Double-clicking index.html is unsupported because JavaScript modules need an HTTP server. No npm installation is needed to play or host.

## Files

index.html — full-screen game UI
style.css — responsive HUD and menus
game.js — controls, cameras, audio, HUD and game lifecycle
physics.js — deterministic driving, track and race logic
world.js — procedural car, scenery, effects and lighting
vendor/three.module.js — bundled Three.js r170
vendor/THREE-LICENSE.txt — required Three.js MIT license
icon.svg — game icon
.nojekyll — disables Jekyll processing on GitHub Pages

This is an original single-player arcade time attack prototype, not an NFS or Forza product. Physics and control-flow tests passed, including two complete laps. Browser GPU rendering could not be visually verified because the available test browser disables WebGL.
