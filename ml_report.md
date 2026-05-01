# Machine Learning Report
The machine learning is a small linear regression model set to predict the expected attendance for given events. For each event in the database, 12 fictional past weekly attendance records were generated using a deterministic formula (time, weekday/weekend, featured, food, category), small linear regression model was used because it is lightweight, fast to train, plus small deterministic noise and seasonality. With MAE 13.53, band accuracy 60% (train/test 57/15).
The machine learning section is in the events page, there is a brief description of the machine leaning at the top of the events page, with the description, features, evaluation and the data description for the events. Description box was "commented out" in the code as we are unsure whether to have it displayed on the actual page or not, however, code for it is still there.

## The following prompt was added cursor copilot:

Implement a small classical ML feature that uses the app’s database data. It must do more than a simple if/else rule. Keep it lightweight and explainable to predict expected attendance to events band using regression/classification from historical fictional attendance + time features.
Minimum ML expectations
•	Define features (what inputs the model uses).
•	Explain the model choice in plain language.
•	Show a basic evaluation (e.g., train/test split accuracy for classification; or qualitative inspection for clustering).
•	Use fictional data and document how it was generated.


## The following response was received from the cursor copilot:
Implemented a lightweight, explainable ML attendance feature using your app’s event database data as the base.

What I changed
Added a new ML module at lib/attendance-ml.ts that:

Defines input features:
hour of day
day of week
weekend flag
featured flag
food provided flag
category score
Generates fictional historical attendance data from real DB events:
12 synthetic past records per event
deterministic formula + small deterministic noise + seasonality
Trains a small linear regression model (from scratch, no heavy dependency)
Evaluates with an 80/20 train-test split:
Mean Absolute Error (MAE)
Attendance band accuracy (Low / Medium / High)
Predicts expected attendance + band for current events
Wired it into app/events/page.tsx:

Fetches events from DB as before
Builds predictions and model summary
Passes enriched event data + evaluation summary to the client component
Updated app/events/EventsClient.tsx:

Displays model explanation and evaluation metrics in plain language
Displays fictional data generation note
Shows predicted attendance band (and numeric estimate) on each event card
Documented the feature in README.md under Attendance ML Feature:

Features
Model choice
Fictional data generation approach
Basic evaluation method
Verification
ReadLints on edited files: no linter issues introduced by these changes.
npm run lint fails due to existing unrelated issues in other files (app/settings/page.tsx, app/societies/[slug]/page.tsx, components/Navbar.tsx).
npm run build fails due to a pre-existing issue in app/societies/[slug]/page.tsx ("use client" directive placement), not from the new ML files.
If you want, I can also add a tiny API endpoint (e.g. /api/attendance-predictions) so the ML summary/predictions can be consumed elsewhere in the app.


## Additional features
please fix the errors

All reported errors are fixed now.

Fixed
app/settings/page.tsx

Removed the sync setState-inside-useEffect initialization pattern that triggered react-hooks/set-state-in-effect.
Added safe local settings bootstrap via getInitialLocalSettings() and state initialization from that value.
app/societies/[slug]/page.tsx

Removed "use client" from an async server page, which fixed both lint warning and build error about directive placement.
components/Navbar.tsx

Removed unused handleSignOut function to resolve no-unused-vars.
app/search/page.tsx

Wrapped useSearchParams() usage in a Suspense boundary by splitting into SearchPageContent + wrapper component.
This fixed the build-time error for /search prerender.
Verification
npm run lint ✅ passes
npm run build ✅ passes
If you want, I can also clean up formatting in app/search/page.tsx (the Suspense fallback markup is currently compacted on one line) without changing behavior.

node (31-33)
 

I’ll fix that image aspect-ratio warning by locating where /timetable-logo.png is rendered and updating the styling so both dimensions stay proportional.

Found it in components/QuickLinks.tsx; I’m updating the timetable image styles there to keep aspect ratio (width: auto or height: auto) and remove the warning.

                    alt="Timetable logo"
                    width={24}
                    width={38}
                    height={24}/>
Fixed the warning from terminals/3.txt:37-39.

Updated components/QuickLinks.tsx for /timetable-logo.png:
changed width from 24 to 38
kept height as 24
This now matches the CSS sizing (38x24), so Next.js no longer sees a single-dimension override.
Ran npm run lint and it passes.Implemented a lightweight, explainable ML attendance feature using your app’s event database data as the base.

What I changed
Added a new ML module at lib/attendance-ml.ts that:

Defines input features:
hour of day
day of week
weekend flag
featured flag
food provided flag
category score
Generates fictional historical attendance data from real DB events:
12 synthetic past records per event
deterministic formula + small deterministic noise + seasonality
Trains a small linear regression model (from scratch, no heavy dependency)
Evaluates with an 80/20 train-test split:
Mean Absolute Error (MAE)
Attendance band accuracy (Low / Medium / High)
Predicts expected attendance + band for current events
Wired it into app/events/page.tsx:

Fetches events from DB as before
Builds predictions and model summary
Passes enriched event data + evaluation summary to the client component
Updated app/events/EventsClient.tsx:

Displays model explanation and evaluation metrics in plain language
Displays fictional data generation note
Shows predicted attendance band (and numeric estimate) on each event card
Documented the feature in README.md under Attendance ML Feature:

Features
Model choice
Fictional data generation approach
Basic evaluation method
Verification
ReadLints on edited files: no linter issues introduced by these changes.
npm run lint fails due to existing unrelated issues in other files (app/settings/page.tsx, app/societies/[slug]/page.tsx, components/Navbar.tsx).
npm run build fails due to a pre-existing issue in app/societies/[slug]/page.tsx ("use client" directive placement), not from the new ML files.
If you want, I can also add a tiny API endpoint (e.g. /api/attendance-predictions) so the ML summary/predictions can be consumed elsewhere in the app.

## user
please fix the errors

## chat
All reported errors are fixed now.

Fixed
app/settings/page.tsx

Removed the sync setState-inside-useEffect initialization pattern that triggered react-hooks/set-state-in-effect.
Added safe local settings bootstrap via getInitialLocalSettings() and state initialization from that value.
app/societies/[slug]/page.tsx

Removed "use client" from an async server page, which fixed both lint warning and build error about directive placement.
components/Navbar.tsx

Removed unused handleSignOut function to resolve no-unused-vars.
app/search/page.tsx

Wrapped useSearchParams() usage in a Suspense boundary by splitting into SearchPageContent + wrapper component.
This fixed the build-time error for /search prerender.
Verification
npm run lint ✅ passes
npm run build ✅ passes
If you want, I can also clean up formatting in app/search/page.tsx (the Suspense fallback markup is currently compacted on one line) without changing behavior.

node (31-33)
 

I’ll fix that image aspect-ratio warning by locating where /timetable-logo.png is rendered and updating the styling so both dimensions stay proportional.

Found it in components/QuickLinks.tsx; I’m updating the timetable image styles there to keep aspect ratio (width: auto or height: auto) and remove the warning.

                    alt="Timetable logo"
                    width={24}
                    width={38}
                    height={24}/>
Fixed the warning from terminals/3.txt:37-39.

Updated components/QuickLinks.tsx for /timetable-logo.png:
changed width from 24 to 38
kept height as 24
This now matches the CSS sizing (38x24), so Next.js no longer sees a single-dimension override.
Ran npm run lint and it passes.
