import { z } from "zod";

export const AssetTypeSchema = z.enum(["image", "audio", "model"]);
export type AssetType = z.infer<typeof AssetTypeSchema>;

export interface AssetDefinition {
    id: string;
    type: AssetType;
    path: string;
    preload?: boolean;
}

export const ASSETS_REGISTRY: Record<string, AssetDefinition> = {
    // Example asset
    "logo_main": {
        id: "logo_main",
        type: "image",
        path: "/assets/images/logo.png",
        preload: true
    }
};
