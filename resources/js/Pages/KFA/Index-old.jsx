import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DataTable from "react-data-table-component";
import axios from "axios";

export default function Index({ auth }) {
    const [data, setData] = useState([]);
    const listUrl = window.location.origin + "/kfa/data/full";

    useEffect(() => {
        axios
            .get(listUrl)
            .then((response) => {
                setData(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);
    const [page, set_page] = useState([0]);
    const columns = [
        {
            name: "No",
            selector: (row, index) =>
                ((page == 0 ? 1 : page) - 1) * 10 + (index + 1),
            width: "80px",
        },
        { name: "Kode Obat", selector: (row) => row.kode, width: "150px" },
        {
            name: "Nama Obat",
            selector: (row) => row.nama_obat,
            width: "auto",
        },
        {
            name: "Status",
            selector: (row) =>
                row.status === "active" ? "Aktif" : "Tidak Aktif",
            width: "200px",
        },
    ];
    const customStyles = {
        headCells: {
            style: {
                fontSize: "14px",
                fontWeight: "bold",
                paddingLeft: "8px",
                paddingRight: "8px",
            },
        },
        rows: {
            style: {
                fontSize: "14px",
            },
        },
    };
    console.log(data);
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
                        <div className="p-6 text-gray-900">
                            <DataTable
                                columns={columns}
                                data={data}
                                pagination
                                onChangePage={set_page}
                                highlightOnHover
                                customStyles={customStyles}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
