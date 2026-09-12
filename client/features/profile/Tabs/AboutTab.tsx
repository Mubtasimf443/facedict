/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/shadcn/card'
import { TabsContent } from '@/components/shadcn/tabs'
import React from 'react'
import AddEducationDialog from '../AddEducationDialog'
import { BriefcaseBusiness, GraduationCap } from 'lucide-react'
import AddJobHistoryDialog from '../AddJobHistoryDialog'


interface IProps {
    education: {
        institution: string;
        degree: string;
        startYear: number;
        endYear: number;
    }[] ,
    job: {
        title: string;
        industry_type: string;
        company: string;
        startDate: {
            day: number;
            month: number;
            year: number;
        };
        endDate: {
            day: number;
            month: number;
            year: number;
        };
    }[] ,
    languages: string[] ;
    religion?: string;
    about :string 
}
export default function AboutTab({ education , job, languages , about, religion }: IProps) {
  return (
     <TabsContent value={'about'} className={'w-full mt-5 flex flex-col md:flex-row justify-start items-start gap-3'}>
              <div className="flex flex-col items-start justify-start md:min-w-xs gap-y-3">
                <Card className="w-full shadow">
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent className=" flex flex-col gap-y-2">
                    {!!education && education.toReversed().map(({ degree, institution, startYear, endYear }, key) =>
                      <div key={key} className="flex flex-row justify-between items-start">
                        <div className="flex flex-row justify-start items-center gap-x-2.5">
                          <GraduationCap size={20} />
                          <div className="flex flex-col justify-start items-start">
                            <strong className="font-medium text-md text-gray-800">{degree}</strong>
                            <span className="text-sm text-gray-600">{institution}</span>
                            <span className="text-xs text-gray-500">{startYear}-{endYear}</span>
                          </div>
                        </div>
                        <button type={'button'} className="text-md text-gray-600 cursor-pointer">&times;</button>
                      </div>
                    )}
                  </CardContent>
                  {!!education && education.length < 4 &&
                    <CardFooter >
                      <CardAction>
                        <AddEducationDialog />
                      </CardAction>
                    </CardFooter>
                  }
                </Card>
                <Card className="w-full shadow">
                  <CardHeader>
                    <CardTitle>Jobs History</CardTitle>
                  </CardHeader>
                  <CardContent className=" flex flex-col gap-y-2">
                    {!!job && job.map(({ title, company, startDate, endDate }, key) =>
                      <div key={key} className="flex flex-row justify-between items-start">
                        <div className="flex flex-row justify-start items-center gap-x-2.5">
                          <BriefcaseBusiness size={20} />
                          <div className="flex flex-col justify-start items-start">
                            <strong className="font-medium text-md text-gray-800">{title}</strong>
                            <span className="text-sm text-gray-600">{company}</span>
                            <span className="text-xs text-gray-500">{`${startDate.day}/${startDate.month}/${startDate.year}`}-{`${endDate.day}/${endDate.month}/${endDate.year}`}</span>
                          </div>
                        </div>
                        <button type={'button'} className="text-md text-gray-600 cursor-pointer">&times;</button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter >
                    <CardAction>
                      <AddJobHistoryDialog />
                    </CardAction>
                  </CardFooter>
                </Card>
              </div>
              <div className="flex flex-col items-start justify-start grow-2 gap-y-2">
                <Card className="w-full shadow">
                  <CardHeader>
                    <CardTitle>Info</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-start items-start w-full gap-y-3">
                    <div className="flex flex-row justify-between items-center w-full">
                      <h3 className="text-md font-medium">Language</h3>
                      <span className="text-sm text-gray-700">{languages?.join(',')}</span>
                    </div>
                    <div className="flex flex-row justify-between items-center w-full">
                      <h3 className="text-md font-medium">Religion</h3>
                      <span className="text-sm text-gray-700">{religion}</span>
                    </div>
                    <div className="flex flex-col jusity-start items-start w-full gap-y-1">
                      <h3 className="text-md font-medium">About</h3>
                      <p className="text-sm text-gray-700 text-justify">
                        {about}
                      </p>
                    </div>
                  </CardContent>

                </Card>
              </div>
            </TabsContent>
  )
}
