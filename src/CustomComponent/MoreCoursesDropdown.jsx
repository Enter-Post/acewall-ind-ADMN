import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "@/Context/GlobalProvider";

const MoreCoursesDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const navigate = useNavigate();
  const { setSelectedSubcategoryId } = useContext(GlobalContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/category/get");
        if (response.data?.categories) {
          setCategories(response.data.categories);
        } else {
          console.error("Invalid response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchSubcategories = async (categoryId) => {
    if (subCategoriesMap[categoryId]) return; // Already fetched

    try {
      const response = await axiosInstance.get(
        `/category/subcategories/${categoryId}`
      );
      if (response.data?.subcategories) {
        setSubCategoriesMap((prev) => ({
          ...prev,
          [categoryId]: response.data.subcategories,
        }));
      } else {
        console.error("Invalid subcategory response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleNavigate = (categoryId, subcategoryId) => {
    console.log(subcategoryId, "subcategoryId");

    setSelectedSubcategoryId(subcategoryId);
    navigate(`/student/courses/${subcategoryId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="text-xs md:text-md lg:text-base font-medium text-gray-700 flex items-center gap-3"
        >
          MORE COURSES
          <ChevronDown className="w-4 h-4 transition-transform duration-300" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="grid grid-row-8 gap-2">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <DropdownMenuSub key={index}>
              <DropdownMenuSubTrigger
                onMouseEnter={() => fetchSubcategories(category._id)}
              >
                {category.title}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {!subCategoriesMap[category._id] ? (
                  <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                ) : subCategoriesMap[category._id].length > 0 ? (
                  subCategoriesMap[category._id].map((sub) => (
                    <Link to={`/student/courses/${sub._id}`}>
                      <DropdownMenuItem
                        key={sub._id}
                        className="cursor-pointer"
                      >
                        {sub.title}
                      </DropdownMenuItem>
                    </Link>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No subcategories</DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))
        ) : (
          <DropdownMenuItem disabled>No categories available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MoreCoursesDropdown;
