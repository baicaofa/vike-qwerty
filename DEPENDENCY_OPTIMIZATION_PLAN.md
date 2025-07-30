# Dependency Optimization Plan

This document outlines a comprehensive plan to reduce dependencies by removing unnecessary libraries and replacing them with existing alternatives or custom implementations.

## 🎯 **Immediate Removals (Unused Dependencies)**

### **High Priority - Remove Immediately**
These dependencies are completely unused and can be safely removed:

```bash
yarn remove embla-carousel-react
yarn remove file-saver
yarn remove html-to-image
yarn remove pako
yarn remove source-map-explorer
yarn remove react-timer-hook
yarn remove immer
yarn remove dexie-export-import
yarn remove dexie-react-hooks
```

**Estimated Bundle Size Reduction**: ~500KB

## 🔄 **Redundant Dependencies (Replace with Existing Libraries)**

### **1. classnames → clsx**
**Current Usage**: 5 files use classnames
**Replacement**: Already have clsx in the project
**Action**: Replace all classnames imports with clsx

```typescript
// Before
import classNames from "classnames";

// After
import { clsx } from "clsx";
```

**Files to Update**:
- `src/pages/ErrorBook/HeadWrongNumber.tsx`
- `src/pages/Typing/components/Setting/index.tsx`
- `src/pages/Typing/components/ResultScreen/ConclusionBar.tsx`
- `src/pages/Typing/components/ResultScreen/RemarkRing.tsx`
- `src/components/InfoPanel/index.tsx`
- `src/components/Drawer/index.tsx`

### **2. @heroicons/react → lucide-react**
**Current Usage**: 3 files use @heroicons/react
**Replacement**: lucide-react has equivalent icons
**Action**: Replace heroicons with lucide-react icons

```typescript
// Before
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// After
import { Eye, EyeOff } from "lucide-react";
```

**Files to Update**:
- `src/pages/login/components/RegisterForm.tsx`
- `src/pages/login/components/LoginForm.tsx`
- `src/pages/verify-email/+Page.tsx`

### **3. react-tooltip → @radix-ui/react-tooltip**
**Current Usage**: 2 files use react-tooltip
**Replacement**: Already have @radix-ui/react-tooltip
**Action**: Replace react-tooltip with Radix UI tooltip

```typescript
// Before
import { Tooltip } from "react-tooltip";

// After
import * as Tooltip from "@radix-ui/react-tooltip";
```

**Files to Update**:
- `src/pages/Analysis/components/HeatmapCharts.tsx`
- `src/components/DonatingCard/components/StickerButton.tsx`

### **4. react-helmet-async → Vike Head API**
**Current Usage**: Not directly used
**Replacement**: Vike provides head management
**Action**: Remove and use Vike's head API

### **5. react-app-polyfill → Remove**
**Current Usage**: Imported in index.tsx
**Replacement**: Modern browsers don't need polyfills
**Action**: Remove import

```typescript
// Remove this line from src/index.tsx
import "react-app-polyfill/stable";
```

**Estimated Bundle Size Reduction**: ~300KB

## 📦 **Heavy Dependencies (Consider Alternatives)**

### **1. echarts (~2MB)**
**Current Usage**: Analysis charts
**Alternatives**:
- Chart.js (lighter, ~200KB)
- D3.js (more control, ~300KB)
- Custom SVG charts (minimal size)

**Recommendation**: Replace with Chart.js for basic charts, custom SVG for complex ones

### **2. xlsx (~1MB)**
**Current Usage**: Excel file parsing
**Alternatives**:
- CSV format (native support)
- Lightweight Excel parsers
- Server-side processing

**Recommendation**: Use CSV format for data exchange

### **3. howler (~500KB)**
**Current Usage**: Audio playback
**Alternatives**:
- Web Audio API (native)
- Custom audio implementation (created)

**Recommendation**: Use custom audio implementation

### **4. mongoose (~2MB)**
**Current Usage**: MongoDB ODM
**Alternatives**:
- Native MongoDB driver
- Prisma (if switching to SQL)
- Custom database layer

**Recommendation**: Consider native MongoDB driver for server-side only

**Estimated Bundle Size Reduction**: ~3MB

## 🔧 **Custom Implementations (Replace Simple Libraries)**

### **1. use-debounce → Custom Implementation**
**Status**: ✅ **COMPLETED**
**Replacement**: Custom debounce utility in `src/utils/debounce.ts`
**Files Updated**: `src/hooks/useReviewStats.ts`

### **2. use-sound → Custom Implementation**
**Status**: ✅ **COMPLETED**
**Replacement**: Custom audio utility in `src/utils/audio.ts`
**Files Updated**: `src/hooks/useKeySounds.ts`, `src/hooks/usePronunciation.ts`

### **3. canvas-confetti → Custom Implementation**
**Status**: ✅ **COMPLETED**
**Replacement**: Custom confetti implementation in `src/utils/confetti.ts`
**Files Updated**: `src/pages/Typing/hooks/useConfetti.ts`

### **4. animate.css → Tailwind CSS Animations**
**Current Usage**: Global CSS import
**Replacement**: Use Tailwind's animation utilities
**Action**: Remove animate.css, use Tailwind classes

```css
/* Replace animate.css with Tailwind animations */
.animate-bounce { animation: bounce 1s infinite; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
```

### **5. mixpanel-browser → Google Analytics**
**Current Usage**: Analytics tracking
**Replacement**: Google Analytics or custom analytics
**Action**: Replace with Google Analytics for better privacy

**Estimated Bundle Size Reduction**: ~200KB

## 📊 **State Management Consolidation**

### **Current State Management**:
- **jotai**: Main state management (keep)
- **zustand**: Auth state management (consider consolidation)
- **swr**: Data fetching (keep)

### **Recommendation**:
Consolidate auth state into jotai atoms instead of zustand:

```typescript
// Replace zustand auth store with jotai atoms
export const authAtom = atom<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
});

export const loginAtom = atom(
  null,
  async (get, set, credentials: LoginCredentials) => {
    // Login logic
  }
);
```

## 🚀 **Implementation Priority**

### **Phase 1: Immediate Removals (Week 1)**
1. Remove all unused dependencies
2. Replace classnames with clsx
3. Replace @heroicons/react with lucide-react
4. Remove react-app-polyfill

### **Phase 2: Custom Implementations (Week 2)**
1. ✅ Replace use-debounce (COMPLETED)
2. ✅ Replace use-sound (COMPLETED)
3. ✅ Replace canvas-confetti (COMPLETED)
4. Replace animate.css with Tailwind animations
5. Replace react-tooltip with @radix-ui/react-tooltip

### **Phase 3: Heavy Dependencies (Week 3-4)**
1. Replace echarts with Chart.js
2. Replace xlsx with CSV format
3. Replace howler with custom audio
4. Consider mongoose alternatives

### **Phase 4: State Management (Week 5)**
1. Consolidate zustand into jotai
2. Optimize state management patterns

## 📈 **Expected Results**

### **Bundle Size Reduction**:
- **Immediate removals**: ~500KB
- **Redundant replacements**: ~300KB
- **Custom implementations**: ~200KB
- **Heavy dependency optimization**: ~3MB
- **Total estimated reduction**: ~4MB

### **Performance Improvements**:
- **Faster initial load**: 20-30% improvement
- **Reduced memory usage**: 15-20% reduction
- **Better tree shaking**: More efficient builds
- **Fewer dependencies**: Easier maintenance

## 🔍 **Monitoring and Validation**

### **Tools to Use**:
```bash
# Analyze bundle size
yarn build:analyze

# Check dependencies
yarn analyze:deps

# Performance check
yarn performance:check

# Dependency analysis
node scripts/dependency-analysis.js
```

### **Success Metrics**:
- Bundle size < 2MB (gzipped)
- Dependencies < 50 total
- Load time < 3 seconds on 3G
- Memory usage < 100MB

## ⚠️ **Risk Mitigation**

### **Testing Strategy**:
1. **Unit tests**: Ensure custom implementations work correctly
2. **Integration tests**: Verify audio and confetti functionality
3. **Performance tests**: Monitor bundle size and load times
4. **User acceptance**: Test with real users

### **Rollback Plan**:
1. Keep original implementations as fallbacks
2. Feature flags for gradual rollout
3. A/B testing for performance-critical changes

## 📋 **Implementation Checklist**

- [ ] Remove unused dependencies
- [ ] Replace classnames with clsx
- [ ] Replace @heroicons/react with lucide-react
- [ ] Remove react-app-polyfill
- [ ] Replace react-tooltip with @radix-ui/react-tooltip
- [ ] Replace animate.css with Tailwind animations
- [ ] Replace echarts with Chart.js
- [ ] Replace xlsx with CSV format
- [ ] Consolidate state management
- [ ] Update documentation
- [ ] Run performance tests
- [ ] Deploy and monitor

This optimization plan will significantly reduce the project's dependency footprint while maintaining or improving functionality.