import { PlaygroundShape } from "./PlaygroundShape";
import { PLAYGROUND_OBJECTS } from "./timeline";

interface Props {
  reduced?: boolean;
}

export function DigitalPlayground({ reduced = false }: Props) {
  return (
    <div className="hero-playground" data-hero-playground aria-hidden="true">
      <div className="hero-playground-title" data-hero-create>
        <span>CREATE</span>
        <span>YOUR DIGITAL</span>
        <span>WORLD</span>
      </div>

      {PLAYGROUND_OBJECTS.map((obj) => (
        <div
          key={obj.id}
          className={[
            "hero-pg-obj",
            obj.desktopOnly ? "hero-pg-obj--desktop" : "",
            obj.tabletPlus ? "hero-pg-obj--tablet" : "",
            reduced ? "is-static" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          data-pg-obj={obj.id}
          data-float={obj.floatDuration}
          style={{
            left: obj.x,
            top: obj.y,
            width: obj.size,
            height: obj.size,
          }}
        >
          <div className="hero-pg-obj-float" data-pg-float>
            <div className="hero-pg-obj-inner" data-pg-inner>
              <PlaygroundShape id={obj.id} size={obj.size} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
