"use client";

import React, {useActionState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-toastify";

import InputField from "@/components/InputField";
import {classSchema, ClassSchema} from "@/lib/formValidationSchemas";
import {createClass, updateClass} from "@/lib/actions";

type SubjectFormProps = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    type: "create" | "update";
    data?: any;
    relatedData?: any;
}

const SubjectForm: React.FC<SubjectFormProps> = ({setShowModal, type, data, relatedData}) => {
    const {
        register,
        formState: {errors},
    } = useForm<ClassSchema>({
        resolver: zodResolver(classSchema),
    });

    const action = type === 'create' ? createClass : updateClass;

    const [currentState, formAction] = useActionState(action, {success: false, error: false});
    const router = useRouter();

    useEffect(() => {
        if (currentState.success) {
            toast.success(`Class has been ${type === 'create' ? 'created' : 'updated'}`);
            setShowModal(false);
            router.refresh();
        }
    }, [currentState, type, setShowModal, router]);

    const {teachers, grades} = relatedData;

    return (
        <form className="flex flex-col gap-8" action={formAction}>
            <h1 className="text-xl font-semibold">{type === 'create' ? "Create a new class" : "Update the class"}</h1>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Class Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
                />
                <InputField
                    label="Capacity"
                    name="capacity"
                    defaultValue={data?.capacity}
                    register={register}
                    error={errors?.capacity}
                />
                {data && (
                    <InputField
                        label="Id"
                        name="id"
                        defaultValue={data?.id}
                        register={register}
                        error={errors?.id}
                        hidden
                    />
                )}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Supervisor</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("supervisorId")}
                        defaultValue={data?.teachers}
                    >
                        {teachers.map(
                            (teacher: { id: string; name: string; surname: string }) => (
                                <option
                                    value={teacher.id}
                                    key={teacher.id}
                                    selected={data && teacher.id === data.supervisorId}
                                >
                                    {teacher.name + " " + teacher.surname}
                                </option>
                            )
                        )}
                    </select>
                    {errors.supervisorId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.supervisorId.message.toString()}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Grade</label>
                    <select
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("gradeId")}
                        defaultValue={data?.gradeId}
                    >
                        {grades.map(
                            (grade: { id: number; level: number }) => (
                                <option
                                    value={grade.id}
                                    key={grade.id}
                                    selected={data && grade.id === data.gradeId}
                                >
                                    {grade.level}
                                </option>
                            )
                        )}
                    </select>
                    {errors.gradeId?.message && (
                        <p className="text-xs text-red-400">
                            {errors.gradeId.message.toString()}
                        </p>
                    )}
                </div>
            </div>
            {currentState.error && <span className="text-red-500">Something went wrong!</span>}
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
}

export default SubjectForm;