'use client';
import { Card, CardBody } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface SiswaDashboardCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export default function SiswaDashboardCard({
  title,
  icon,
  href,
}: SiswaDashboardCardProps) {
  const router = useRouter();
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push(href)}
      className='cursor-pointer'>
      <Card className='bg-white shadow-md hover:shadow-xl transition-all p-4 rounded-2xl border border-gray-100'>
        <CardBody className='flex flex-col items-center justify-center gap-3 text-center'>
          <div className='text-4xl text-primary'>{icon}</div>
          <h3 className='font-semibold text-lg text-gray-800'>{title}</h3>
        </CardBody>
      </Card>
    </motion.div>
  );
}
