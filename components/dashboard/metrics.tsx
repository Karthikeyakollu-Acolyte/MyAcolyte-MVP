import { Card } from '@/components/ui/card'
import Image from 'next/image'
import totalstudy from '@/public/totalstudy.svg'
import goal from '@/public/goal.svg'
import currentknow from '@/public/currentknow.svg'
import knowledge from '@/public/knowledge.svg'
import todays from '@/public/todays.svg'

const images = [totalstudy, goal, currentknow, knowledge, todays];

export function Metrics() {
  return (
    <>
    <h1 className="text-2xl font-semibold font-rubik mb-6 text-[#6105A2]">Reports</h1>
    <div className="flex space-x-6">
      {images.map((img, index) => (
        <Card key={index} className="p-4 w-[171.14px] h-[152.4px] rounded-2xl border-[#EFF0F6]">
          <Image src={img} alt="acolyte"/>
        </Card>
      ))}
    </div>
    </>
  )
}
