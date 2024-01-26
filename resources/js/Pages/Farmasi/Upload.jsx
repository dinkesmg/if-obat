import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Upload({ auth }) {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            const uploadUrl = window.location.origin + "/farmakes/upload/data";
            console.log(uploadUrl);
            const csrfToken = document.head.querySelector(
                'meta[name="csrf-token"]'
            ).content;

            const formData = new FormData();
            formData.append("file", selectedFile);

            axios
                .post(uploadUrl, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": csrfToken,
                    },
                })
                .then((response) => {
                    console.log(response); // Lakukan sesuatu dengan respons dari server (jika perlu)
                    document.getElementById("fileInput").value = "";
                    setSelectedFile(null);
                    const successMessages = response.data.messages;

                    let succesMessageList = "<ul>";
                    successMessages.forEach((successMessage) => {
                        succesMessageList += `<li>${successMessage}</li>`;
                    });
                    succesMessageList += "</ul>";
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        html: succesMessageList,
                        showConfirmButton: false,
                        timer: 5000,
                        customClass: {
                            container: "text-center", // Menambahkan kelas CSS untuk rata kiri
                        },
                    });
                })
                .catch((error) => {
                    console.error("Error:", error); // Tangani kesalahan (jika perlu)

                    const errorMessages = error.response.data.messages;

                    // Buat daftar pesan kesalahan
                    let errorMessageList = "<ul >";
                    errorMessages.forEach((errorMessage) => {
                        errorMessageList += `<li>${errorMessage}</li>`;
                    });
                    errorMessageList += "</ul>";

                    // Tampilkan notifikasi SweetAlert untuk error
                    Swal.fire({
                        icon: "error",
                        title: "Oops!",
                        html: errorMessageList,
                        showConfirmButton: false,
                        timer: 5000,
                        customClass: {
                            container: "text-center", // Menambahkan kelas CSS untuk rata kiri
                        },
                    });
                });
        } else {
            console.warn("Pilih file terlebih dahulu");
            Swal.fire({
                icon: "info",
                title: "Info",
                text: "Pilih file terlebih dahulu",
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Upload Farmalkes Instalasi Farmasi
                </h2>
            }
        >
            <Head title="Upload Farmalkes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mt-4">
                                <label
                                    htmlFor="fileInput"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Pilih File
                                </label>
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept=".xls, .xlsx"
                                    onChange={handleFileChange}
                                    className="mt-1 p-2 border rounded-md w-full"
                                />
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={handleUpload}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
