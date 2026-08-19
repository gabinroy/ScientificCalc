# OpenCalc 99X

A modular, authentic scientific calculator emulator built with **React Native**, **Expo**, and **TypeScript**.

---

## 🏛️ Project Origins & Disclaimer

> [!IMPORTANT]
> - **Independent Project**: This project is an independent, open-source emulator.
> - **Educational Purpose & Legacy**: It was created to commemorate the legacy and educational impact of a popular, now-discontinued scientific calculator (the fx-991EX series).
> - **Trademark Disclaimer**: It is not affiliated with, endorsed by, or associated with Casio Computer Co., Ltd.

---

## 🌟 Key Highlights

- **🔒 Strict Portrait Orientation**: Strictly locked in portrait mode (`PORTRAIT_UP`) using `expo-screen-orientation`.
- **🎨 Dynamic & Selectable Themes**: Automatic system color scheme detection (`useColorScheme`) with selectable **System Default**, **Light**, and **Dark** modes persisted via AsyncStorage.
- **⚡ Zero `eval()` or `Function()` Engine**: 100% deterministic custom Shunting-Yard token stack parser and state engine (`utils/mathEngine.ts`) with zero arbitrary code execution risks.
- **📟 High-Res Dot Matrix LCD**: Dual-line LCD layout with battery/solar status cells, mode indicators (`COMP`, `CMPLX`, `BASE-N`, `MAT`, `VCT`, `STAT`, `EQN`, `TABLE`), angle units (`D`, `R`, `G`), memory (`M`), and cursor support.
- **📜 Calculation History & D-Pad Replay**:
  - **▲ Up / ▼ Down**: Scroll backward and forward across historical calculation entries.
  - **◀ Left / ▶ Right**: Load the previewed calculation back into the live editable input buffer.
  - **Visual Tape Panel**: Slide-down calculation tape with tap-to-restore capabilities.
- **⌨️ Hardware Keyboard Density & Key Shortcuts**:
  - **SHIFT + AC (OFF)**: Displays the `OPENCALC 99X` shutdown banner and either exits the app or enters standby mode (toggleable).
  - **SHIFT + MENU (SETUP / ABOUT)**: Opens the developer bio, license info, theme selector, and open-source support dialog.
  - **Yellow SHIFT**: Activates calculus ($\int dx, \frac{d}{dx}$), polar/rectangular coordinate conversions ($\text{Pol}, \text{Rec}$), inverse trigonometry ($\sin^{-1}, \cos^{-1}, \tan^{-1}$), factorial ($x!$), permutations ($nPr$), combinations ($nCr$), random numbers ($\text{Ran}\#$), and constants ($\pi$).
  - **Red ALPHA**: Types memory variables ($A, B, C, D, E, F, M, x, y$), random integers ($\text{RanInt}\#$), and Euler's constant ($e$).
  - **Memory Operations**: Support for $STO \to [A-F, M, x, y]$, $M+$, $M-$, $MR$, and $MC$.
- **🎛️ 12 Native Calculation Modes**:
  1. **Calculate**: Standard fractions, roots, powers, trig, logs, calculus approximations, coordinate conversions.
  2. **Complex**: Cartesian ($a+bi$) and polar operations.
  3. **Base-N**: Decimal, Hexadecimal, Binary, Octal conversions & bitwise operations.
  4. **Matrix**: Matrix creation, multiplication, determinants ($2\times 2, 3\times 3$).
  5. **Vector**: Dot product, vector arithmetic.
  6. **Statistics**: 1-variable statistical analysis ($n, \bar{x}, \Sigma x, \sigma x, s_x, \min, \max$).
  7. **Distribution**: Normal, Binomial, Poisson probability distributions.
  8. **Spreadsheet**: Mini formula-based cell grid evaluation.
  9. **Table**: Numerical function table generator ($f(x)$).
  10. **Equation/Func**: Simultaneous linear equations & polynomial root solvers.
  11. **Inequality**: Quadratic & polynomial inequality solutions.
  12. **Ratio**: $A:B = X:D$ or $A:B = C:X$ proportional calculators.
- **📱 First-Launch Tutorial (`IntroScreen`)**: Onboarding tutorial persisted with `@react-native-async-storage/async-storage`.
- **ℹ️ Interactive Quick Guide (`HelpModal`) & About Modal (`AboutModal`)**: Top-bar info manuals detailing all key shortcuts and operations.

---

## 🛡️ Security & Privacy Compliance

OpenCalc 99X is built with a **security-first, zero-telemetry** architecture:
- **Zero Arbitrary Code Execution**: Absolutely no `eval()`, `new Function()`, or dynamic runtime script interpreters. All math parsing uses a deterministic AST/Shunting-Yard stack.
- **Zero Tracking & Zero Ads**: No analytic SDKs, ad networks, or telemetry trackers.
- **Offline by Design**: All mathematical evaluations, matrix determinants, calculus approximations, and history storage execute 100% locally on device.
- **Minimal Permissions**: No invasive device permissions requested (no camera, contacts, microphone, or background location).

---

## 📂 Project Architecture

```
ScientificCalc/
├── App.tsx                    # Root component (Orientation lock, AsyncStorage check, ThemeProvider)
├── ThemeContext.tsx           # Dynamic Light/Dark/System theme provider & color dictionary
├── screens/
│   ├── IntroScreen.tsx        # First-launch onboarding tutorial
│   └── CalculatorScreen.tsx   # Core calculator screen & state orchestrator (flex-ratio layout)
├── components/
│   ├── Display.tsx            # Dual-line dot matrix LCD & Mode overlay menu (with power-off standby)
│   ├── Keypad.tsx             # Physical-style dense scientific button grid with circular D-Pad
│   ├── HelpModal.tsx          # Interactive quick reference guide
│   └── AboutModal.tsx         # App Bio, Creator info (G Abin Roy), Theme Selector, and Buy Me a Coffee demo
├── utils/
│   └── mathEngine.ts          # Custom AST / Shunting-Yard tokenizer & calculus / coordinate engine (no eval)
├── assets/                    # App icons (adaptive background, monochrome, foreground, splash)
├── app.json                   # Expo application configuration
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript strict configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app on your physical mobile device or an Android/iOS emulator

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npx expo start
```

3. Open the app:
   - **Web Browser**: Press <kbd>w</kbd> in the terminal or run `npm run web` / `npx expo start --web`.
   - **Mobile Device**: Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS).

---

## 🧪 Testing & Verification

To verify TypeScript types across the entire project:
```bash
npx tsc --noEmit
```

---

## 📄 License & Copyright Notice

```plaintext
OpenCalc 99X Copyright (C) 2026 G Abin Roy This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
```

See [LICENSE](./LICENSE) for the full GNU GPLv3 text and [NOTICE](./NOTICE) for third-party template notices (Expo/MIT).
