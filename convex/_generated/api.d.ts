/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as apiMetadata from "../apiMetadata.js";
import type * as campaigns from "../campaigns.js";
import type * as donations from "../donations.js";
import type * as donorDriveDebug from "../donorDriveDebug.js";
import type * as donor_drive_validators from "../donor_drive_validators.js";
import type * as donors from "../donors.js";
import type * as goals from "../goals.js";
import type * as lib_admin from "../lib/admin.js";
import type * as lib_donordrive from "../lib/donordrive.js";
import type * as lib_donordriveHttp from "../lib/donordriveHttp.js";
import type * as randomizer from "../randomizer.js";
import type * as randomizerItem from "../randomizerItem.js";
import type * as randomizerSpin from "../randomizerSpin.js";
import type * as rotator from "../rotator.js";
import type * as schema_apiMetadata from "../schema/apiMetadata.js";
import type * as schema_campaigns from "../schema/campaigns.js";
import type * as schema_donations from "../schema/donations.js";
import type * as schema_donorDriveDebug from "../schema/donorDriveDebug.js";
import type * as schema_donors from "../schema/donors.js";
import type * as schema_goals from "../schema/goals.js";
import type * as schema_randomizer from "../schema/randomizer.js";
import type * as schema_randomizerSpins from "../schema/randomizerSpins.js";
import type * as schema_rotator from "../schema/rotator.js";
import type * as schema_segments from "../schema/segments.js";
import type * as schema_syncState from "../schema/syncState.js";
import type * as schema_viewedDonations from "../schema/viewedDonations.js";
import type * as schema_wheelRedemptions from "../schema/wheelRedemptions.js";
import type * as segment from "../segment.js";
import type * as sync from "../sync.js";
import type * as syncStore from "../syncStore.js";
import type * as viewedDonations from "../viewedDonations.js";
import type * as wheelRedemption from "../wheelRedemption.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  apiMetadata: typeof apiMetadata;
  campaigns: typeof campaigns;
  donations: typeof donations;
  donorDriveDebug: typeof donorDriveDebug;
  donor_drive_validators: typeof donor_drive_validators;
  donors: typeof donors;
  goals: typeof goals;
  "lib/admin": typeof lib_admin;
  "lib/donordrive": typeof lib_donordrive;
  "lib/donordriveHttp": typeof lib_donordriveHttp;
  randomizer: typeof randomizer;
  randomizerItem: typeof randomizerItem;
  randomizerSpin: typeof randomizerSpin;
  rotator: typeof rotator;
  "schema/apiMetadata": typeof schema_apiMetadata;
  "schema/campaigns": typeof schema_campaigns;
  "schema/donations": typeof schema_donations;
  "schema/donorDriveDebug": typeof schema_donorDriveDebug;
  "schema/donors": typeof schema_donors;
  "schema/goals": typeof schema_goals;
  "schema/randomizer": typeof schema_randomizer;
  "schema/randomizerSpins": typeof schema_randomizerSpins;
  "schema/rotator": typeof schema_rotator;
  "schema/segments": typeof schema_segments;
  "schema/syncState": typeof schema_syncState;
  "schema/viewedDonations": typeof schema_viewedDonations;
  "schema/wheelRedemptions": typeof schema_wheelRedemptions;
  segment: typeof segment;
  sync: typeof sync;
  syncStore: typeof syncStore;
  viewedDonations: typeof viewedDonations;
  wheelRedemption: typeof wheelRedemption;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
