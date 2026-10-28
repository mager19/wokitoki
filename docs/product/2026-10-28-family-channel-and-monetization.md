# WoKiToKi — Family Channel and Monetization

Date: 2026-10-28
Status: channel decided; monetization open

## 1. Context

Today the proof of concept assumes that family members receive and answer the box's voice notes through WhatsApp (WhatsApp Business API). That ties the product to Meta: per-message pricing, platform rules that change over time, and no control over the family-side experience.

The audience also widened on 2026-10-28. The main focus stays on children aged 3 to 7, and older adults are now a secondary audience (see the "Adultos mayores" tab on the landing).

## 2. Decision: an own family app replaces WhatsApp

Family members install a dedicated, deliberately minimal app. Its core screen is the family group with two actions: **record and send** a voice note, and **listen** to the box's messages.

Why:
- It removes the dependency on Meta's pricing and policy changes.
- The marginal cost per user drops to almost zero: push notifications are free, and short audio storage is cheap.
- The team owns the full experience, for example each relative's melody and colour can also appear in the app.

### 2.1 Roles

- **Group admin**: the parent who sets up the box. Admin features live **inside the same app**, not in a separate web panel. The admin can:
  - invite relatives (QR code or short code),
  - remove members,
  - assign each relative's melody and colour.
- **Member**: any invited relative. Members can send and listen.

### 2.2 Invitation flow (v1)

1. The admin generates an invitation QR.
2. The QR opens the app store page.
3. On first launch, the relative scans the same QR or types a short code, and joins the group.

Deferred deep linking (the invite surviving the install so that one scan does everything) is a later improvement, not a v1 requirement.

### 2.3 Known risks

- **Notification permission is the main failure point.** If a relative denies it, the box's messages arrive but are never noticed. Mitigations: an onboarding screen that explains why notifications are needed, and a recommendation that someone from the family helps grandparents during first setup.
- **Install friction for grandparents.** It is lower with the QR flow, but not zero. This matters most in the child use case, where grandparents are the ones who answer.
- **Ongoing app maintenance.** The app needs updates for new iOS and Android versions, store reviews (Apple is strict with apps related to children), and a developer account (Apple: 99 USD/year).

### 2.4 Rough effort

A one-developer MVP takes about 6 to 10 weeks, using one cross-platform codebase (React Native/Expo or Flutter). Scope:
- phone sign-in (SMS code),
- family group and invitations,
- recording and playback,
- audio storage (Supabase),
- push notifications,
- store publication.

### 2.5 Architecture note

The messaging channel sits behind an interface in the backend, so the box does not know how its messages reach the family. A WhatsApp adapter can still be added later if a market or partner requires it, without rewriting the core.

## 3. Monetization (open)

### 3.1 Proposal under discussion

Sell a starter pack that includes the box and **3 users**, and charge a **monthly fee per extra user**.

### 3.2 Concerns raised

- **It penalises the product's core value.** WoKiToKi gets more valuable as more relatives answer. A per-seat fee pushes families to stop at three.
- **It does not track costs.** Without Meta, an extra user costs almost nothing. The real costs are the hardware, the servers and the app maintenance.
- **Weak recurring revenue.** If only families with more than three users pay monthly, most families never pay anything after the purchase. Servers, support and app updates are then left unfunded.

### 3.3 Alternative recommended

- **Starter pack**: the box plus **3 to 6 months of service** included.
- **After that, a flat, low family subscription** with **generous members included** (for example up to 8).
- **Upsell by boxes or features, not by people**, for example:
  - a second box (a sibling, or the grandparents' house),
  - permanent voice-message history.

### 3.4 Channel to explore for older adults (B2B2C)

Institutions buy or subsidise boxes in volume, which can bring higher margin and lower churn than direct-to-family sales. Possible buyers:
- care homes and day centres,
- family compensation funds (cajas de compensación),
- insurers and prepaid health plans,
- municipal programmes against loneliness.

### 3.5 Next step

Before fixing prices, model the cost per family per month (hardware amortisation, servers, storage, app stores). Then run a price test with the leads captured by the landing.

## 4. Impact on current assets

The landing is a simple demo and can change at any time. When the app becomes the channel, these parts must be updated:
- the FAQ answer "¿La familia necesita instalar algo?",
- every "responde desde su WhatsApp" message, in the hero, the family cards and "Cómo funciona",
- the privacy policy (data processors, app data),
- the brochure and the demo video, which show WhatsApp.
