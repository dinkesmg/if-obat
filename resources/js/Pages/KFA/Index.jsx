import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import JsonView from "@uiw/react-json-view";

const customStyles = `
  .react-json-view .icon-copy {
    display: none !important;
  }
`;

export default function Index({ auth }) {
    const { kfa } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        // Filter data based on the search query
        const filtered = kfa.data.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, kfa.data]);

    const handleOpenWindow = () => {
        // Open a new window when the button is clicked
        window.open("https://smg.city/kfadkk", "_blank");
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Kamus Farmasi dan Alat Kesehatan Kemenkes
                </h2>
            }
        >
            <Head title="KFA Kemenkes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <button
                            className="p-2 bg-blue-500 text-white rounded-md btn-sm float-right mb-5 mt-5 mr-5"
                            onClick={handleOpenWindow}
                        >
                            Detail KFA
                        </button>
                        <div className="p-6 bg-white border-b border-dark-200">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Search:
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 p-2 border rounded-md w-full"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border rounded-lg overflow-hidden">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-2 px-3 border-b-2 border-gray-300">
                                                No.
                                            </th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300">
                                                Jenis
                                            </th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300">
                                                Kode KFA
                                            </th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300">
                                                NIE
                                            </th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300">
                                                Nama
                                            </th>
                                            <th className="py-2 px-3 border-b-2 border-gray-300">
                                                Detail
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {filteredData.map(
                                            (
                                                {
                                                    id,
                                                    jenis,
                                                    kfa_code,
                                                    nie,
                                                    name,
                                                    response,
                                                },
                                                index
                                            ) => (
                                                <tr
                                                    key={id} // Provide a unique key using the 'id' property
                                                    className={
                                                        index % 2 === 0
                                                            ? "bg-dark-100"
                                                            : "bg-white"
                                                    }
                                                >
                                                    <td className="py-2 px-3 border-b border-gray-300">
                                                        {(kfa.current_page -
                                                            1) *
                                                            kfa.per_page +
                                                            index +
                                                            1}
                                                    </td>
                                                    <td className="py-2 px-3 border-b border-gray-300">
                                                        {jenis}
                                                    </td>
                                                    <td className="py-2 px-3 border-b border-gray-300">
                                                        {kfa_code}
                                                    </td>
                                                    <td className="py-2 px-3 border-b border-gray-300">
                                                        {nie}
                                                    </td>
                                                    <td className="py-2 px-3 border-b border-gray-300">
                                                        {name}
                                                    </td>
                                                    <td className="py-2 px-3 border-b border-gray-300">
                                                        <style>
                                                            {customStyles}
                                                        </style>
                                                        <JsonView
                                                            value={JSON.parse(
                                                                response
                                                            )}
                                                            enableClipboard={
                                                                false
                                                            }
                                                            collapsed={true}
                                                            displayDataTypes={
                                                                false
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination class="mt-6" links={kfa.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
