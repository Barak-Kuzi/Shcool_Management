"use client";

import React, {useActionState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-toastify";

import InputField from "@/components/InputField";
import {subjectSchema, SubjectSchema} from "@/lib/formValidationSchemas";
import {createSubject, updateSubject} from "@/lib/actions";

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
    } = useForm<SubjectSchema>({
        resolver: zodResolver(subjectSchema),
    });

    const action = type === 'create' ? createSubject : updateSubject;

    const [currentState, formAction] = useActionState(action, {success: false, error: false});
    const router = useRouter();

    useEffect(() => {
        if (currentState.success) {
            toast.success(`Subject has been ${type === 'create' ? 'created' : 'updated'}`);
            setShowModal(false);
            router.refresh();
        }
    }, [currentState, type, setShowModal, router]);

    const {teachers} = relatedData;

    return (
        <form className="flex flex-col gap-8" action={formAction}>
            <h1 className="text-xl font-semibold">{type === 'create' ? "Create a new subject" : "Update the subject"}</h1>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Subject Name"
                    name="name"
                    defaultValue={data?.name}
                    register={register}
                    error={errors?.name}
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
                    <label className="text-xs text-gray-500">Teachers</label>
                    <select
                        multiple
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                        {...register("teachers")}
                        defaultValue={data?.teachers}
                    >
                        {teachers.map(
                            (teacher: { id: string; name: string; surname: string }) => (
                                <option value={teacher.id} key={teacher.id}>
                                    {teacher.name + " " + teacher.surname}
                                </option>
                            )
                        )}
                    </select>
                    {errors.teachers?.message && (
                        <p className="text-xs text-red-400">
                            {errors.teachers.message.toString()}
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