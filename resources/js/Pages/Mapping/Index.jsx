import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import AsyncSelect from "react-select/async";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

export default function Dashboard({ auth }) {
    const [inputs, setInputs] = useState([{ id: 1, value: "", kfa: "" }]);
    const [dataList, setDataList] = useState([]);
    const farmakesUrl = window.location.origin + "/farmakes/data";
    const kfaUrl = window.location.origin + "/kfa/api";
    // const kfaUrl = "http://119.2.50.170:6536/satu-sehat/api/farmasi";
    const simpanUrl = window.location.origin + "/mapping/simpan";

    const [data, setData] = useState([]);
    // const listUrl = window.location.origin + "/farmakes/data";

    // useEffect(() => {
    //     axios
    //         .get(farmakesUrl)
    //         .then((response) => {
    //             setData(response.data.data);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching data:", error);
    //         });
    // }, []);

    const fetchData = () => {
        axios
            .get(farmakesUrl)
            .then((response) => {
                setData(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };
    useEffect(() => {
        // Memanggil fetchData pada mount komponen
        fetchData();

        // Menetapkan interval untuk memanggil fetchData setiap 2 detik
        const intervalId = setInterval(() => {
            fetchData();
        }, 5000);

        // Membersihkan interval pada saat komponen dilepas
        return () => clearInterval(intervalId);
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
            name: "Kode KFA",
            selector: (row) => (row.kfa_code != null ? row.kfa_code : "-"),
            width: "200px",
        },
        {
            name: "Nama KFA",
            selector: (row) => (row.dt_kfa != null ? row.dt_kfa.name : "-"),
            width: "300px",
        },
        // Uncomment the following section if you want to add the "Action" column
        /*
        {
            name: "Action",
            cell: (row) => (
                <div>
                    <button
                        type="button"
                        id={row.id}
                        // onClick={() => oc_hapus(row.id)}
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                    >
                        Hapus
                    </button>
                    <button
                        type="button"
                        id={row.id}
                        // onClick={() => oc_edit(row.id)}
                        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                    >
                        Edit
                    </button>
                </div>
            ),
            width: "250px",
        },
        */
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

    useEffect(() => {
        axios
            .get(farmakesUrl)
            .then((response) => {
                setDataList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const loadOptions = (inputValue, callback) => {
        axios
            .get(`${kfaUrl}?q=${inputValue}`)
            .then((response) => {
                const resp = response.data.hasil;
                if (resp.total > 0) {
                    const options = resp.data.map((item) => ({
                        label: `${item.kfa_code} - ${item.name}`,
                        code: item.kfa_code,
                        value: item.id,
                    }));
                    callback(options);
                }
            })
            .catch((error) => {
                console.error("Error fetching KFA data:", error);
                callback([]);
            });
    };

    const handleAddInput = () => {
        const newInput = {
            id: inputs.length + 1,
            value: "",
        };
        setInputs([...inputs, newInput]);
    };

    const handleRemoveInput = (id) => {
        // Pengecekan untuk memastikan tidak menghapus input jika hanya ada satu input tersisa
        if (inputs.length === 1) {
            return;
        }

        const updatedInputs = inputs.filter((input) => input.id !== id);
        setInputs(updatedInputs);
    };

    const handleInputChange = (id, value) => {
        const updatedInputs = inputs.map((input) =>
            input.id === id ? { ...input, value } : input
        );
        setInputs(updatedInputs);
    };

    const handleSelectChange = (selectedOption, action, inputId, name) => {
        const updatedInputs = inputs.map((input) => {
            if (input.id === inputId) {
                if (name === "kfa_data") {
                    return { ...input, kfa: selectedOption.code };
                } else {
                    const code = selectedOption.label.split(" ");
                    console.log(code);
                    return { ...input, value: code[0] };
                }
            } else {
                return input;
            }
        });

        setInputs(updatedInputs);
    };
    const handleSelectChangeKFA = (selectedOption, action, inputId) => {
        const updatedInputs = [...get];
        setInputs(updatedInputs);
    };
    console.log(inputs);
    const handleSimpan = async () => {
        try {
            console.log(inputs);
            const transformedData = transformData(inputs);

            await axios
                .post(simpanUrl, transformedData)
                .then((response) => {
                    console.log(response); // Lakukan sesuatu dengan respons dari server (jika perlu)
                    const successMessages = response.data.messages;
                    console.log(successMessages);
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
                    setInputs([]);
                    // setInputs((prevInputs) => {
                    //     const remainingInput = prevInputs.slice(-1); // Sisakan satu form input
                    //     return remainingInput;
                    // });
                    // setInputs((prevInputs) => {
                    //     const remainingInput = prevInputs.slice(-1); // Sisakan satu form input
                    //     const lastInput = remainingInput[0];
                    //     return [
                    //         ...remainingInput,
                    //         {
                    //             id: lastInput.id + 1,
                    //             value: "", // Bersihkan nilai input
                    //             kfa: lastInput.kfa, // Pertahankan nilai async select
                    //         },
                    //     ];
                    // });
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

            // Additional logic upon successful post, if needed
            console.log("Data successfully posted!");
        } catch (error) {
            // Handle the error, e.g., log it or show a user-friendly message
            console.error("Error posting data:", error);
        }
    };
    const transformData = (originalData) => {
        const transformedData = {
            kfa: [],
            kode: [],
        };

        originalData.forEach((item) => {
            transformedData.kfa.push(item.kfa);
            transformedData.kode.push(item.value);
        });

        return transformedData;
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Mapping Farmakes IF - KFA
                </h2>
            }
        >
            <Head title="Mapping Farmakes IF - KFA" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 h-full">
                            <h3 className="mb-5">
                                Data Farmakes IF & KFA Kemenkes
                            </h3>
                            {inputs.map((input, index) => (
                                <div
                                    key={index}
                                    className="mb-2 flex items-center"
                                >
                                    <input
                                        type="text"
                                        value={input.value}
                                        onChange={(e) =>
                                            handleInputChange(
                                                input.id,
                                                e.target.value
                                            )
                                        }
                                        required={input.required}
                                        className="p-2 border rounded-md mr-2  w-3/6"
                                        list={`dataList_${input.id}`}
                                    />
                                    {dataList.length != 0 && ( // Menambahkan pengecekan agar dataList tidak kosong
                                        <datalist id={`dataList_${input.id}`}>
                                            {dataList.data.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={
                                                        item.kode +
                                                        " - " +
                                                        item.nama_obat
                                                    }
                                                />
                                            ))}
                                        </datalist>
                                    )}
                                    {/* Pengecekan untuk memastikan tidak menampilkan tombol Remove jika hanya ada satu input */}
                                    <AsyncSelect
                                        className="w-3/6"
                                        isClearable
                                        name="kfa_data"
                                        value={input.selectValue}
                                        loadOptions={(inputValue, callback) =>
                                            loadOptions(inputValue, callback)
                                        }
                                        onChange={(selectedOption, action) =>
                                            handleSelectChange(
                                                selectedOption,
                                                action,
                                                input.id,
                                                "kfa_data"
                                            )
                                        }
                                    />
                                    {inputs.length > 1 && (
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded btn btn-sm ml-5"
                                            onClick={() =>
                                                handleRemoveInput(input.id)
                                            }
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded btn btn-sm"
                                onClick={handleAddInput}
                            >
                                Tambah
                            </button>
                        </div>
                        <div className="mt-4 text-center mb-5">
                            <button
                                onClick={handleSimpan}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 h-full">
                            <h3>Hasil Mapping Farmakes di IF</h3>
                            <div className="w-full overflow-auto max-h-screen">
                                {" "}
                                {/* Tambahkan kelas overflow-auto dan max-h-screen di sini */}
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
            </div>
        </AuthenticatedLayout>
    );
}
