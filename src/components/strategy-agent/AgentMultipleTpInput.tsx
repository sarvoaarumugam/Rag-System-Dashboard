import { X } from "lucide-react";
import { SetStateAction } from "react";

export type TpType = {
  tp_min: number;
  tp_max: number;
  tp_step: number;
  position_min: number;
  position_max: number;
  position_step: number;
};

interface MultipleTpInputProps {
  multipleTpProp: TpType[];
  setMultipleTpProp: React.Dispatch<SetStateAction<TpType[]>>;
}

const MultipleTpInput: React.FC<MultipleTpInputProps> = ({
  multipleTpProp,
  setMultipleTpProp,
}) => {
  return (
    <>
      <div className="flex flex-col gap-1">
        {multipleTpProp.map((tp, index) => (
          <div
            className="flex flex-col gap-2 border border-dashed rounded-lg p-2"
            key={index}
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold text-black/50">
                Take Profit - {index + 1}
              </div>
              {index > 0 && (
                <button
                  onClick={() =>
                    setMultipleTpProp((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="hover:opacity-50 w-6 h-6 bg-black/20 rounded-full text-black/50 border border-black/30 flex items-center justify-center"
                  type="button"
                >
                  <X />
                </button>
              )}
            </div>

            <hr />

            <div className="flex flex-col gap-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">TP min (%)</div>
                <input
                  className="px-2 py-1 w-full rounded border-2 shadow"
                  type="number"
                  step={1}
                  value={tp.tp_min}
                  onChange={(e) =>
                    setMultipleTpProp((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, tp_min: Number(e.target.value) }
                          : item
                      )
                    )
                  }
                />
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-1">TP max (%)</div>
                <input
                  className="px-2 py-1 w-full rounded border-2 shadow"
                  type="number"
                  step={0.01}
                  value={tp.tp_max}
                  onChange={(e) =>
                    setMultipleTpProp((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, tp_max: Number(e.target.value) }
                          : item
                      )
                    )
                  }
                />
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-1">TP step (%)</div>
                <input
                  className="px-2 py-1 w-full rounded border-2 shadow"
                  type="number"
                  step={0.01}
                  value={tp.tp_step}
                  onChange={(e) =>
                    setMultipleTpProp((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, tp_step: Number(e.target.value) }
                          : item
                      )
                    )
                  }
                />
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-1">
                  Position min (%)
                </div>
                <input
                  className="px-2 py-1 w-full rounded border-2 shadow"
                  type="number"
                  step={1}
                  value={tp.position_min}
                  onChange={(e) =>
                    setMultipleTpProp((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, position_min: Number(e.target.value) }
                          : item
                      )
                    )
                  }
                />
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-1">
                  Position max (%)
                </div>
                <input
                  className="px-2 py-1 w-full rounded border-2 shadow"
                  type="number"
                  step={0.01}
                  value={tp.position_max}
                  onChange={(e) =>
                    setMultipleTpProp((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, position_max: Number(e.target.value) }
                          : item
                      )
                    )
                  }
                />
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-1">
                  Position step (%)
                </div>
                <input
                  className="px-2 py-1 w-full rounded border-2 shadow"
                  type="number"
                  step={0.01}
                  value={tp.position_step}
                  onChange={(e) =>
                    setMultipleTpProp((prev) =>
                      prev.map((item, i) =>
                        i === index
                          ? { ...item, position_step: Number(e.target.value) }
                          : item
                      )
                    )
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {multipleTpProp.length < 3 && (
        <div className="mt-2">
          <button
            className="w-full py-1 bg-blue-100 border border-blue-400 text-blue-500 rounded-lg"
            onClick={() =>
              setMultipleTpProp((prev) => {
                const last = prev[prev.length - 1] ?? {
                  tp_min: 1,
                  tp_max: 1,
                  tp_step: 0,
                  position_min: 100,
                  position_max: 100,
                  position_step: 0,
                };
                return [...prev, { ...last }];
              })
            }
            type="button"
          >
            Add TP
          </button>
        </div>
      )}
    </>
  );
};

export default MultipleTpInput;
