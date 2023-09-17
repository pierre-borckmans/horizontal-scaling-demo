import React, { useEffect, useMemo, useState } from "react";
import cc from "classcat";
import { useGauge } from "use-gauge";

interface Props {
  value: number;
  refreshTime: number;
}

export function Gage(props: Props) {
  const { value, refreshTime } = props;

  const [velocity, setVelocity] = useState(value);

  useEffect(() => {
    if (value === 0) {
      setVelocity(0);
      return;
    }
    setVelocity(Math.pow((value / 100 + velocity / 100) / 2, 1.3) * 100);
  }, [value, refreshTime]);

  const gauge = useGauge({
    domain: [0, 100],
    startAngle: 90,
    endAngle: 270,
    numTicks: 21,
    diameter: 200,
  });

  const needle = useMemo(
    () =>
      gauge.getNeedleProps({
        value: 0,
        baseRadius: 8,
        tipRadius: 2,
      }),
    []
  );

  return (
    <svg className="w-full overflow-visible p-2" {...gauge.getSVGProps()}>
      <g id="ticks">
        {gauge.ticks.map((angle) => {
          const asValue = gauge.angleToValue(angle);
          const showText = asValue % 20 === 0;

          return (
            <React.Fragment key={angle}>
              <line
                className={cc([
                  "stroke-gray-300",
                  {
                    "stroke-red-300": asValue <= 20,
                    "stroke-yellow-300": asValue >= 60 && asValue <= 80,
                    "stroke-green-400": asValue >= 80,
                  },
                ])}
                strokeWidth={2}
                {...gauge.getTickProps({
                  angle,
                  length: 8,
                })}
              />
              {showText && (
                <text
                  className="fill-gray-400 text-sm font-medium"
                  {...gauge.getLabelProps({ angle, offset: 20 })}
                >
                  {asValue}
                </text>
              )}
            </React.Fragment>
          );
        })}
      </g>
      <g id="needle">
        <circle className="fill-gray-300" {...needle.base} r={12} />
        <circle className="fill-gray-700" {...needle.base} />
        <circle className="fill-gray-700" {...needle.tip} />
        <polyline
          className="fill-gray-700/80 transition-all duration-[300ms] ease-linear"
          points={needle.points}
          style={{
            transform: `rotate(${(velocity / 100) * 180}deg)`,
          }}
        />
        <circle className="fill-white" {...needle.base} r={4} />
      </g>
    </svg>
  );
}
