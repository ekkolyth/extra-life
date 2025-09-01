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
import type * as donorDriveDebug from "../donorDriveDebug.js";
import type * as goals from "../goals.js";
import type * as randomizer from "../randomizer.js";
import type * as randomizerItem from "../randomizerItem.js";
import type * as rotator from "../rotator.js";
import type * as segment from "../segment.js";
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
  donorDriveDebug: typeof donorDriveDebug;
  goals: typeof goals;
  randomizer: typeof randomizer;
  randomizerItem: typeof randomizerItem;
  rotator: typeof rotator;
  segment: typeof segment;
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
