import gameObby from "@/assets/roblox/game-obby.png";
import gameBattle from "@/assets/roblox/game-battle.png";
import gameTycoon from "@/assets/roblox/game-tycoon.png";
import gameRacing from "@/assets/roblox/game-racing.png";
import sgZombie from "@/assets/roblox/sg-zombie.png";
import sgSky from "@/assets/roblox/sg-sky.png";
import sgCity from "@/assets/roblox/sg-city.png";
import sgDragon from "@/assets/roblox/sg-dragon.png";
import sgPizza from "@/assets/roblox/sg-pizza.png";
import sgSpace from "@/assets/roblox/sg-space.png";
import gameSky from "@/assets/roblox/game-plane.jpg";
import gameRuner from "@/assets/roblox/game-runer.jpg";
import gameSurvival from "@/assets/roblox/survivaled.jpg";

const byFile: Record<string, (typeof gameObby)> = {
  "game-obby.png": gameObby,
  "game-battle.png": gameBattle,
  "game-tycoon.png": gameTycoon,
  "game-racing.png": gameRacing,
  "game-plane.jpg": gameSky,
  "game-runner.jpg": gameRuner,
  "survivaled.jpg": gameSurvival,
  "sg-zombie.png": sgZombie,
  "sg-sky.png": sgSky,
  "sg-city.png": sgCity,
  "sg-dragon.png": sgDragon,
  "sg-pizza.png": sgPizza,
  "sg-space.png": sgSpace,
};

export function getAsset(fileName: string) {
  const asset = byFile[fileName];
  if (!asset) {
    throw new Error(`Unknown asset: ${fileName}`);
  }
  return asset;
}
