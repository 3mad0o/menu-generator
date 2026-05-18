import { use, useState } from "react";
import { makeSection, updateSectionName, deleteSection } from "@/api/menu";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { addSectionVariant } from "@/api/menu";
import { useFieldArray, useFormContext } from "react-hook-form";

// --- Sub-Component: Dynamic Table ---
const SectionTable = () => {
  const [columns, setColumns] = useState([{ id: "col-1", label: "" }]);
  const [rows, setRows] = useState([{ id: "row-1", values: { "col-1": "" } }]);

  const addColumn = async () => {
    const res = await addSectionVariant();
    const newColId = `col-${Date.now()}`;
    setColumns([...columns, { id: newColId, label: "" }]);
    setRows(
      rows.map((row) => ({ ...row, values: { ...row.values, [newColId]: "" } }))
    );
  };

  const addRow = () => {
    const newRowId = `row-${Date.now()}`;
    const newValues = {};
    columns.forEach((col) => (newValues[col.id] = ""));
    setRows([...rows, { id: newRowId, values: newValues }]);
  };

  const updateCell = (rowId, colId, value) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? { ...row, values: { ...row.values, [colId]: value } }
          : row
      )
    );
  };

  return (
    <div className="mt-4 border rounded-lg overflow-hidden bg-white">
      <div className="flex gap-2 p-2 border-b bg-gray-50">
        <button
          size="sm"
          variant="outline"
          onClick={addRow}
          className="h-8 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Row
        </button>
        <button
          size="sm"
          variant="outline"
          onClick={addColumn}
          className="h-8 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Column
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.id} className="border p-2 bg-gray-50">
                  <Input
                    placeholder="Variant Name"
                    className="h-8 font-bold border-none shadow-none focus-visible:ring-1"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.id} className="border p-2">
                    <Input
                      placeholder="Item Name"
                      value={row.values[col.id]}
                      onChange={(e) =>
                        updateCell(row.id, col.id, e.target.value)
                      }
                      className="h-8 border-none shadow-none focus-visible:ring-1"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Component: Sections ---
const Sections = () => {
  const { control, register, getValues,setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });
  const handleNewSection = async () => {
    const res = await makeSection(getValues("slug"));
    append((prev) => [
      {
        id: res.data.id,
        title: res.data.title ?? `Section ${res.data.id}`,
        isOpen: true, // Open by default when created
      },
    ]);
  };

  const toggleSection = (id,index) => {
    const section = fields[index];
    setValue(`sections.${index}.isOpen`, !section.isOpen);
  };

  const handleDeleteSection = async (id,index) => {
    await deleteSection(getValues("slug"), id);
    remove(index);
  };

  const handleTitleChange = async (id, value) => {
    setSectionsData((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, title: value } : section
      )
    );
    await updateSectionName(slug, id, value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Add New Section button */}
      <button
        className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        onClick={handleNewSection}
      >
        <div className="bg-blue-100 rounded-full p-1">
          <Plus className="w-5 h-5" />
        </div>
        <span>Add New Section</span>
      </button>

      {/* Sections List */}
      <div className="space-y-4">
        {fields.map((section, index) => (
          <div
            key={section.id}
            className="border rounded-xl bg-gray-50/50 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-3 bg-white border-b">
              <p>isOpen {section.isOpen}</p>
              <div
                className="flex items-center gap-3 cursor-pointer flex-1"
                onClick={() => toggleSection(section.id,index)}
              >
                {section.isOpen ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
                <Input
                  {...register(`sections.${index}.title`)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleTitleChange(section.id, e.target.value)
                  }
                  className="font-semibold h-9 bg-transparent border-transparent hover:border-gray-200 focus:bg-white transition-all"
                />
              </div>

              <button
                onClick={() => handleDeleteSection(section.id,index)}
                className="text-red-400 hover:text-red-600 p-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Collapsible Content */}
            {section.isOpen && (
              <div className="p-4">
                <SectionTable />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sections;
