/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as apiMetadata from "../apiMetadata.js";
import type * as donorDriveData from "../donorDriveData.js";
import type * as donorDriveDebug from "../donorDriveDebug.js";
import type * as donor_drive_validators from "../donor_drive_validators.js";
import type * as goals from "../goals.js";
import type * as randomizer from "../randomizer.js";
import type * as randomizerItem from "../randomizerItem.js";
import type * as rotator from "../rotator.js";
import type * as schema_apiMetadata from "../schema/apiMetadata.js";
import type * as schema_donations from "../schema/donations.js";
import type * as schema_donorDriveData from "../schema/donorDriveData.js";
import type * as schema_donorDriveDebug from "../schema/donorDriveDebug.js";
import type * as schema_goals from "../schema/goals.js";
import type * as schema_randomizer from "../schema/randomizer.js";
import type * as schema_rotator from "../schema/rotator.js";
import type * as schema_segments from "../schema/segments.js";
import type * as schema_topDonor from "../schema/topDonor.js";
import type * as schema_viewedDonations from "../schema/viewedDonations.js";
import type * as schema_wheelRedemptions from "../schema/wheelRedemptions.js";
import type * as segment from "../segment.js";
import type * as viewedDonations from "../viewedDonations.js";
import type * as wheelRedemption from "../wheelRedemption.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  apiMetadata: typeof apiMetadata;
  donorDriveData: typeof donorDriveData;
  donorDriveDebug: typeof donorDriveDebug;
  donor_drive_validators: typeof donor_drive_validators;
  goals: typeof goals;
  randomizer: typeof randomizer;
  randomizerItem: typeof randomizerItem;
  rotator: typeof rotator;
  "schema/apiMetadata": typeof schema_apiMetadata;
  "schema/donations": typeof schema_donations;
  "schema/donorDriveData": typeof schema_donorDriveData;
  "schema/donorDriveDebug": typeof schema_donorDriveDebug;
  "schema/goals": typeof schema_goals;
  "schema/randomizer": typeof schema_randomizer;
  "schema/rotator": typeof schema_rotator;
  "schema/segments": typeof schema_segments;
  "schema/topDonor": typeof schema_topDonor;
  "schema/viewedDonations": typeof schema_viewedDonations;
  "schema/wheelRedemptions": typeof schema_wheelRedemptions;
  segment: typeof segment;
  viewedDonations: typeof viewedDonations;
  wheelRedemption: typeof wheelRedemption;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
