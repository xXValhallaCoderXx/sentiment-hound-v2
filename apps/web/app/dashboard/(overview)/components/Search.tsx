"use client";
import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useDebouncedCallback } from "@mantine/hooks";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const ListSearch = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {


    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        placeholder={placeholder}
        leftSection={<IconSearch size={18} />}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
      />
      {/* <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
    </div>
  );
};

export default ListSearch

// export default function Search({ placeholder }: { placeholder: string }) {
//   function handleSearch(term: string) {
//     console.log(term);
//   }

//   return (
//     <div className="relative flex flex-1 flex-shrink-0">
//       <label htmlFor="search" className="sr-only">
//         Search
//       </label>
//       <input
//         className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
//         placeholder={placeholder}
//         onChange={(e) => {
//           handleSearch(e.target.value);
//         }}
//       />
//       {/* <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
//     </div>
//   );
// }
