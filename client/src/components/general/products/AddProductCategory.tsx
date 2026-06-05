import { useState } from "react";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import { api } from "../../../api/api";

function AddProductCategory({ setCategoriesList, isAdmin }: any) {
  const [addCategoryModalIsOpen, setAddCategoryModalIsOpen] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true)
      if (newCategory.trim() !== "") {
        const res = await api("products/category", { method: "POST", item: { item: newCategory } });
        const data = await res.json();

        setAddCategoryModalIsOpen(false);
        setLoading(false);
        setCategoriesList((prev: any) => [...prev, data.result])

      }
    } catch (error) {
      console.error(error, "error");
    }
  };
  return (

    <div>
      {isAdmin && (
        <button
          className="w-30 h-10 border rounded flex self-end justify-center items-center bg-gray-200
                         text-gray-900 hover:bg-gray-300 cursor-pointer"
          onClick={() => setAddCategoryModalIsOpen(true)}
          disabled={loading}
        >
          Add category
        </button>
      )}

      {addCategoryModalIsOpen && (
        <Modal title="Add new Category" onClose={() => setAddCategoryModalIsOpen(false)}>
          <form
            className="flex flex-col border border-gray-400 min-h-30 gap-5 w-70 p-3 text-gray-800"
            onSubmit={handleSubmit}
          >
            <label className="text-xl font-bold">
              Category title
              <input
                required
                type="text"
                className="border px-2 py-1 w-full text-sm font-normal"
                placeholder="Enter the name"
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </label>
            <Button>Add</Button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default AddProductCategory;
