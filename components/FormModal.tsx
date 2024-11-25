"use client";

import React, {useActionState, useEffect, useState} from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";

import {deleteClass, deleteExam, deleteStudent, deleteSubject, deleteTeacher} from "@/lib/actions";
import {FormContainerProps} from "@/components/FormContainer";

const deleteActionMap = {
    subject: deleteSubject,
    class: deleteClass,
    teacher: deleteTeacher,
    student: deleteStudent,
    exam: deleteExam,
// // TODO: OTHER DELETE ACTIONS
//     parent: deleteSubject,
//     lesson: deleteSubject,
//     assignment: deleteSubject,
//     result: deleteSubject,
//     attendance: deleteSubject,
//     event: deleteSubject,
//     announcement: deleteSubject,
};

// Lazy load the forms
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
    loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
    loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
    loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
    loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
    loading: () => <h1>Loading...</h1>,
});

const forms: {
    [key: string]: (setShowModal: React.Dispatch<React.SetStateAction<boolean>>, type: "create" | "update", data?: any, relatedData?: any) => JSX.Element;
} = {
    teacher: (setShowModal, type, data, relatedData) => (
        <TeacherForm setShowModal={setShowModal} type={type} data={data} relatedData={relatedData}/>
    ),
    student: (setShowModal, type, data, relatedData) => (
        <StudentForm setShowModal={setShowModal} type={type} data={data} relatedData={relatedData}/>
    ),
    subject: (setShowModal, type, data, relatedData) => (
        <SubjectForm setShowModal={setShowModal} type={type} data={data} relatedData={relatedData}/>
    ),
    class: (setShowModal, type, data, relatedData) => (
        <ClassForm setShowModal={setShowModal} type={type} data={data} relatedData={relatedData}/>
    ),
    exam: (setShowModal, type, data, relatedData) => (
        <ExamForm setShowModal={setShowModal} type={type} data={data} relatedData={relatedData}/>
    ),
};

const FormModal: React.FC<FormContainerProps & { relatedData?: any }> = ({table, type, data, id, relatedData}) => {

    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const bgColor =
        type === "create" ? "bg-customYellow" : type === "update" ? "bg-blueSky" : "bg-customPurple";

    const [showModal, setShowModal] = useState<boolean>(false);

    const handleModal = () => {
        setShowModal(!showModal);
    }

    const Form = () => {
        const [currentState, formAction] = useActionState(deleteActionMap[table], {success: false, error: false});

        const router = useRouter();

        useEffect(() => {
            if (currentState.success) {
                toast.success(`${table} has been deleted!`);
                setShowModal(false);
                router.refresh();
            }
        }, [currentState, router]);

        return type === "delete" && id ? (
            <form action={formAction} className="p-4 flex flex-col gap-4">
                <input type="text | number" name="id" value={id} hidden readOnly/>
                <span className="text-center font-medium">
                  All data will be lost. Are you sure you want to delete this {table}?
                </span>
                <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
                    Delete
                </button>
            </form>
        ) : type === "create" || type === "update" ? (
            forms[table](setShowModal, type, data, relatedData)
        ) : (
            "Form not found!"
        );
    };

    return (
        <>
            <button
                className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
                onClick={handleModal}
            >
                <Image src={`/${type}.png`} alt={`${type} button`} width={16} height={16}/>
            </button>
            {showModal && (
                <div
                    className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div
                        className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <Form/>
                        <div className="absolute top-4 right-4 cursor-pointer" onClick={handleModal}>
                            <Image src="/close.png" alt="" width={14} height={14}/>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default FormModal;