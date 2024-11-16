"use client";

import Image from 'next/image';
import {RadialBarChart, RadialBar, ResponsiveContainer} from 'recharts';

const data = [
    {
        name: 'Total',
        count: 106,
        fill: 'white',
    },
    {
        name: 'Girls',
        count: 53,
        fill: '#FAE27C',
    },
    {
        name: 'Boys',
        count: 53,
        fill: '#C3EBFA',
    },
];

const CountChart = () => {
    return (
        <div className="bg-white rounded-xl h-[75%] w-full p-4">
            <div className="flex justify-between gap-4">
                <h1 className="text-lg font-semibold">Students</h1>
                <Image src="/moreDark.png" alt="student" width={20} height={20}/>
            </div>
            <div className="relative w-full h-full">
                <ResponsiveContainer>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
                        <RadialBar
                            background
                            dataKey="count"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                <Image
                    src="/maleFemale.png"
                    alt="male & female"
                    width={50}
                    height={50}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            </div>
            <div className="flex justify-center gap-16">
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-blueSky rounded-full"></div>
                    <h1 className="font-bold">1,234</h1>
                    <h2 className="text-xs text-gray-300">Boys (55%)</h2>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-customYellow rounded-full"></div>
                    <h1 className="font-bold">1,123</h1>
                    <h2 className="text-xs text-gray-300">Girls (45%)</h2>
                </div>
            </div>
        </div>
    );
}

export default CountChart;