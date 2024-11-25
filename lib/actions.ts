"use server";

import {revalidatePath} from "next/cache";
import prisma from "@/lib/prisma";
import {clerkClient} from "@clerk/nextjs/server";
import {getUserDetails} from "@/lib/utils";

type CurrentState = {
    success: boolean;
    error: boolean;
}

export const createSubject = async (currentState: CurrentState, formData: FormData) => {
    console.log(formData.getAll("teachers"));

    try {
        await prisma.subject.create({
            data: {
                name: formData.get("name") as string,
                teachers: {
                    connect: formData.getAll("teachers").map((teacherId) => ({id: teacherId as string})),
                }
            },
        });
        // revalidatePath("/list/subjects");
        return {success: true, error: false};
    } catch (error) {
        console.log(error)
        return {success: false, error: true};
    }
};

export const updateSubject = async (currentState: CurrentState, formData: FormData) => {
    const id = formData.get("id") as string;
    try {
        await prisma.subject.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name: formData.get("name") as string,
                teachers: {
                    set: formData.getAll("teachers").map((teacherId) => ({id: teacherId as string})),
                }
            },
        });
        // revalidatePath("/list/subjects");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

export const deleteSubject = async (currentState: CurrentState, formData: FormData) => {
    const id = formData.get("id") as string;
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id),
            },
        });
        // revalidatePath("/list/subjects");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

export const createClass = async (currentState: CurrentState, formData: FormData) => {
    const name = formData.get("name") as string;
    const capacity = parseInt(formData.get("capacity") as string);
    const supervisorId = formData.get("supervisorId") as string;
    const gradeId = parseInt(formData.get("gradeId") as string);
    try {
        await prisma.class.create({
            data: {
                name,
                capacity,
                supervisorId,
                gradeId
            }
        });
        // revalidatePath("/list/class");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

export const updateClass = async (currentState: CurrentState, formData: FormData) => {
    const name = formData.get("name") as string;
    const capacity = parseInt(formData.get("capacity") as string);
    const supervisorId = formData.get("supervisorId") as string;
    const gradeId = parseInt(formData.get("gradeId") as string);
    const id = formData.get("id") as string;
    try {
        await prisma.class.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
                capacity,
                supervisorId,
                gradeId
            }
        });
        // revalidatePath("/list/class");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

export const deleteClass = async (currentState: CurrentState, formData: FormData) => {
    const id = formData.get("id") as string;
    try {
        await prisma.class.delete({
            where: {
                id: parseInt(id),
            },
        });
        // revalidatePath("/list/class");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

enum UserSex {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export const createTeacher = async (img: any, currentState: CurrentState, formData: FormData) => {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const bloodType = formData.get("bloodType") as string;
    const sex = formData.get("sex") as UserSex;
    const birthday = new Date(formData.get("birthday") as string);
    const subjects = formData.getAll("subjects") as string[];

    try {
        const clerkUser = await clerkClient();
        const user = await clerkUser.users.createUser({
            username: username,
            password: password,
            firstName: name,
            lastName: surname,
            publicMetadata: {role: "teacher"}
        });

        await prisma.teacher.create({
            data: {
                id: user.id,
                username: username,
                name: name,
                surname: surname,
                email: email || null,
                phone: phone || null,
                address: address,
                img: img || null,
                bloodType: bloodType,
                sex: sex,
                birthday: birthday,
                subjects: {
                    connect: subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    })),
                },
            },
        });

        // revalidatePath("/list/teachers");
        return {success: true, error: false};
    } catch (err: any) {
        console.error("Error creating teacher:", err);
        if (err.errors) {
            err.errors.forEach((error: any) => {
                console.error("Error detail:", error);
            });
        }
        return {success: false, error: true};
    }
};

export const updateTeacher = async (img: any, currentState: CurrentState, formData: FormData) => {
    const id = formData.get("id") as string;
    if (!id) {
        return {success: false, error: true};
    }
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const bloodType = formData.get("bloodType") as string;
    const sex = formData.get("sex") as UserSex;
    const birthday = new Date(formData.get("birthday") as string);
    const subjects = formData.getAll("subjects") as string[];

    try {
        const clerkUser = await clerkClient();
        const user = await clerkUser.users.updateUser(id, {
            username: username,
            ...(password !== "" && {password: password}),
            firstName: name,
            lastName: surname,
        });

        await prisma.teacher.update({
            where: {
                id: id,
            },
            data: {
                username: username,
                ...(password !== "" && {password: password}),
                name: name,
                surname: surname,
                email: email || null,
                phone: phone || null,
                address: address,
                img: img || null,
                bloodType: bloodType,
                sex: sex,
                birthday: birthday,
                subjects: {
                    set: subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId),
                    })),
                },
            },
        });

        // revalidatePath("/list/teachers");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

export const deleteTeacher = async (currentState: CurrentState, formData: FormData) => {
    const id = formData.get("id") as string;
    try {
        const clerkUser = await clerkClient();
        await clerkUser.users.deleteUser(id);

        await prisma.teacher.delete({
            where: {
                id: id,
            },
        });

        // revalidatePath("/list/teachers");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

export const createStudent = async (img: any, currentState: CurrentState, formData: FormData) => {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const bloodType = formData.get("bloodType") as string;
    const sex = formData.get("sex") as UserSex;
    const birthday = new Date(formData.get("birthday") as string);
    const gradeId = parseInt(formData.get("gradeId") as string);
    const classId = parseInt(formData.get("classId") as string);
    const parentId = formData.get("parentId") as string;

    try {
        // Unable to add a student to the selected class if the class is full.
        const classItem = await prisma.class.findUnique({
            where: {id: classId},
            include: {_count: {select: {students: true}}},
        });

        if (classItem && classItem?.capacity === classItem?._count.students) {
            return {success: false, error: true};
        }


        const clerkUser = await clerkClient();
        const user = await clerkUser.users.createUser({
            username: username,
            password: password,
            firstName: name,
            lastName: surname,
            publicMetadata: {role: "student"}
        });

        await prisma.student.create({
            data: {
                id: user.id,
                username: username,
                name: name,
                surname: surname,
                email: email || null,
                phone: phone || null,
                address: address,
                img: img || null,
                bloodType: bloodType,
                sex: sex,
                birthday: birthday,
                gradeId: gradeId,
                classId: classId,
                parentId: parentId,
            },
        });

        // revalidatePath("/list/students");
        return {success: true, error: false};
    } catch (err: any) {
        console.error("Error creating teacher:", err);
        if (err.errors) {
            err.errors.forEach((error: any) => {
                console.error("Error detail:", error);
            });
        }
        return {success: false, error: true};
    }
};

export const updateStudent = async (img: any, currentState: CurrentState, formData: FormData) => {
    const id = formData.get("id") as string;
    if (!id) {
        return {success: false, error: true};
    }
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const bloodType = formData.get("bloodType") as string;
    const sex = formData.get("sex") as UserSex;
    const birthday = new Date(formData.get("birthday") as string);
    const gradeId = parseInt(formData.get("gradeId") as string);
    const classId = parseInt(formData.get("classId") as string);
    const parentId = formData.get("parentId") as string;

    try {
        const clerkUser = await clerkClient();
        const user = await clerkUser.users.updateUser(id, {
            username: username,
            ...(password !== "" && {password: password}),
            firstName: name,
            lastName: surname,
        });

        await prisma.student.update({
            where: {
                id: id,
            },
            data: {
                username: username,
                ...(password !== "" && {password: password}),
                name: name,
                surname: surname,
                email: email || null,
                phone: phone || null,
                address: address,
                img: img || null,
                bloodType: bloodType,
                sex: sex,
                birthday: birthday,
                gradeId: gradeId,
                classId: classId,
                parentId: parentId,
            },
        });

        // revalidatePath("/list/students");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

export const deleteStudent = async (currentState: CurrentState, formData: FormData) => {
    const id = formData.get("id") as string;
    try {
        const clerkUser = await clerkClient();
        await clerkUser.users.deleteUser(id);

        await prisma.student.delete({
            where: {
                id: id,
            },
        });

        // revalidatePath("/list/students");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

export const createExam = async (currentState: CurrentState, formData: FormData) => {
    const title = formData.get("title") as string;
    const startTime = new Date(formData.get("startTime") as string);
    const endTime = new Date(formData.get("endTime") as string);
    const lessonId = parseInt(formData.get("lessonId") as string);

    const {role, userId} = await getUserDetails();

    try {
        // Checking whether the user is a teacher, and also whether the teacher has lessons in the system.
        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: lessonId,
                },
            });

            if (!teacherLesson) {
                return {success: false, error: true};
            }
        }

        await prisma.exam.create({
            data: {
                title: title,
                startTime: startTime,
                endTime: endTime,
                lessonId: lessonId,
            },
        });

        // revalidatePath("/list/exams");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

export const updateExam = async (currentState: CurrentState, formData: FormData) => {
    const title = formData.get("title") as string;
    const startTime = new Date(formData.get("startTime") as string);
    const endTime = new Date(formData.get("endTime") as string);
    const lessonId = parseInt(formData.get("lessonId") as string);
    const id = parseInt(formData.get("id") as string);

    const {role, userId} = await getUserDetails();

    try {
        // Checking whether the user is a teacher, and also whether the teacher has lessons in the system.
        if (role === "teacher") {
            const teacherLesson = await prisma.lesson.findFirst({
                where: {
                    teacherId: userId!,
                    id: lessonId,
                },
            });

            if (!teacherLesson) {
                return {success: false, error: true};
            }
        }

        await prisma.exam.update({
            where: {
                id: id,
            },
            data: {
                title: title,
                startTime: startTime,
                endTime: endTime,
                lessonId: lessonId,
            },
        });

        // revalidatePath("/list/exams");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};

export const deleteExam = async (currentState: CurrentState, formData: FormData) => {
    const id = formData.get("id") as string;

    const {role, userId} = await getUserDetails();

    try {
        // Checking whether the user is a teacher, and also whether the test belongs to him.
        await prisma.exam.delete({
            where: {
                id: parseInt(id),
                ...(role === "teacher" ? {lesson: {teacherId: userId!}} : {}),
            },
        });

        // revalidatePath("/list/exams");
        return {success: true, error: false};
    } catch (err) {
        console.log(err);
        return {success: false, error: true};
    }
};