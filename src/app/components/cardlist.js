import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const files = ["PEAKS"];

// Use React.memo for static components like `Tag`
const Tag = React.memo(({ text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full cursor-pointer hover:bg-purple-200 transition"
  >
    {text}
  </button>
));

const CardList = ({ runs, peaks }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const viewCard = (card, file) => {
    setSelectedCard(card);
    setSelectedFile(file);
  };

  const goBack = () => {
    setSelectedCard(null);
    setSelectedFile(null);
  };

  // Filter and memoize data for the table to avoid unnecessary calculations
  const tableData = useMemo(() => {
    if (!selectedCard) return [];
  
    // Ensure thresholds are available in selectedCard
    const lowVerThreshold = selectedCard.low_ver_threshold || 0;
    const lowLatThreshold = selectedCard.low_lat_threshold || 0;
  
    return peaks
      .filter(
        (peak) =>
          Number(peak.section) === selectedCard._id &&
          (peak.vertical_peak >= lowVerThreshold || peak.lateral_peak >= lowLatThreshold)
      )
      .sort((a, b) => a.currentkm - b.currentkm) // Sort by `currentkm`
      .map((peak, index) => ({
        serialNo: index + 1,
        ...peak,
      }));
  }, [selectedCard, peaks]);
  
  

  // Define columns dynamically
  const columns = useMemo(
    () =>
      selectedCard
        ? [
            { accessorKey: "serialNo", header: "Serial No." },
            { accessorKey: "currentkm", header: "Km" },
            { accessorKey: "distance", header: "Distance" },
            { accessorKey: "vertical_peak", header: "Vertical Peak" },
            { accessorKey: "lateral_peak", header: "Lateral Peak" },
            { accessorKey: "speed", header: "Speed" },
          ]
        : [],
    [selectedCard]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (selectedCard) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen mt-16">
        <button
          onClick={goBack}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-blue-600"
        >
          Back
        </button>

        <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 border border-gray-200">
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-gray-200 px-2 py-1 rounded-full text-gray-700">
              #{selectedCard._id}
            </span>
            <span className="bg-gray-200 px-2 py-1 rounded-full text-gray-700">
              {selectedCard.cal_date || "N/A"}
            </span>
            <span className="bg-gray-200 px-2 py-1 rounded-full text-gray-700">
              {selectedCard.run_time || "N/A"}
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
            Run {selectedCard._id}
          </h3>

          <div className="text-gray-600 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            <p>
              <strong>Train:</strong> {selectedCard.train_number || "N/A"}
            </p>
            <p>
              <strong>Coach:</strong> {selectedCard.coach_number || "N/A"}
            </p>
            <p>
              <strong>Railway:</strong> {selectedCard.railway || "N/A"}
            </p>
            <p>
              <strong>Machine number:</strong> LIC/OMS/047
            </p>
            <p>
              <strong>Vetrical Peak Threshold:</strong> {selectedCard.low_ver_threshold}
            </p>
            <p>
              <strong>Lateral Peak Threshold:</strong> {selectedCard.low_lat_threshold}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <Tag key={index} text={file} onClick={() => setSelectedFile(file)} />
            ))}
          </div>
        </div>

        {selectedFile === "PEAKS" && (
          <div className="mt-6 text-black">
            <h4 className="text-md md:text-lg font-bold text-gray-700 mb-4">
              Viewing Peaks Data for Run {selectedCard._id}
            </h4>

            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="border border-gray-300 px-4 py-2 text-xs md:text-sm text-gray-600 text-left"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="bg-white even:bg-gray-50 hover:bg-gray-100"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="border border-gray-300 px-4 py-2 text-sm text-gray-700 text-left"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-gray-50 min-h-screen mt-16">
      {runs
        .sort((a, b) => a._id - b._id)
        .map((run) => (
          <div
            key={run._id}
            className="bg-white shadow-lg rounded-lg p-4 md:p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-200"
          >
            <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-gray-500 mb-4">
              <span className="bg-gray-200 px-2 py-1 rounded-full text-gray-700">
                #{run._id}
              </span>
              <span className="bg-gray-200 px-2 py-1 rounded-full text-gray-700">
                {run.cal_date || "N/A"}
              </span>
              <span className="bg-gray-200 px-2 py-1 rounded-full text-gray-700">
                {run.run_time || "N/A"}
              </span>
            </div>

            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
              Run {run._id}
            </h3>

            <div className="text-gray-600 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <p>
                <strong>Train:</strong> {run.train_number || "N/A"}
              </p>
              <p>
                <strong>Coach:</strong> {run.coach_number || "N/A"}
              </p>
              <p>
                <strong>Railway:</strong> {run.railway || "N/A"}
              </p>
              <p>
              <strong>Machine number:</strong> LIC/OMS/047
            </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <Tag key={index} text={file} onClick={() => viewCard(run, file)} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CardList;
