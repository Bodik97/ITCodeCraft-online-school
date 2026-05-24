import gameObby from "@/assets/game-obby.png";
import gameBattle from "@/assets/game-battle.png";
import gameTycoon from "@/assets/game-tycoon.png";
import gameRacing from "@/assets/game-racing.png";
import sgZombie from "@/assets/sg-zombie.png";
import sgSky from "@/assets/sg-sky.png";
import sgCity from "@/assets/sg-city.png";
import sgDragon from "@/assets/sg-dragon.png";
import sgPizza from "@/assets/sg-pizza.png";
import sgSpace from "@/assets/sg-space.png";
import gameSky from "@/assets/game-plane.jpg";
import gameRuner from "@/assets/game-runer.jpg";
import gameSurvival from "@/assets/survivaled.jpg";

const byFile: Record<string, (typeof gameObby)> = {
  "game-obby.png": gameObby,
  "game-battle.png": gameBattle,
  "game-tycoon.png": gameTycoon,
  "game-racing.png": gameRacing,
  "game-plane.jpg" : gameSky,
  "game-runner.jpg" : gameRuner,
  "survivaled.jpg" : gameSurvival,
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
