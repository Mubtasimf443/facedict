/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
'use client'
import { Button } from '@/components/shadcn/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog'
import { Field, FieldDescription, FieldLabel } from '@/components/shadcn/field';
import { Input } from '@/components/shadcn/input';
import { XIcon } from 'lucide-react';
import React, { SubmitEvent, useState } from 'react'

export default function AddEducationDialog() {
    const [isDialogOpen, setIsDialogOpen]= useState<boolean>(false);
    const [isFormDisabled, setIsFormDisabled]= useState<boolean>(false);
    const [degree,setDegree]= useState<string>('');
    const [institution, setInstitution] = useState<string>(''); 
    const [startYear,setStartYear]= useState<number>();
    const [endYear, setEndYear] = useState<number>();
    async function handleFormSubmit(event:SubmitEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            setIsFormDisabled(true);
        } catch (error) {
            console.error({error});
        } finally {
            setIsFormDisabled(false);
            setIsDialogOpen(false);
        }
    }
  return (
    <Dialog  open={isDialogOpen}>
        <DialogTrigger 
        onClick={event => setIsDialogOpen(true)}
        className={'bg-transparent text-primary border-2 border-primary rounded-md py-1 px-2 font-medium text-sm '} >Add Education</DialogTrigger>
        <DialogContent showCloseButton={false}>
            <DialogHeader className='flex flex-row justify-between items-center'>
                <DialogTitle>Add Education</DialogTitle>
                <button type='button' onClick={event => setIsDialogOpen(false)} ><XIcon size={20} /></button>
            </DialogHeader>
            <form onSubmit={handleFormSubmit}>
                <Field>
                      <FieldLabel htmlFor='degree-input'>Degree</FieldLabel>
                      <Input
                          type='text'
                          name='degree'
                          id='degree-input'
                          placeholder='Degree Name'
                          maxLength={255}
                          minLength={10}
                          className='placeholder:text-gray-600'
                          value={degree}
                          onChange={event => setDegree(event.target.value)}
                          disabled={isFormDisabled}
                          required
                      />
                    <FieldDescription></FieldDescription>
                </Field>
                <Field>
                      <FieldLabel htmlFor='institution-input'>Institution</FieldLabel>
                      <Input
                          type='text'
                          name='institution'
                          id='institution-input'
                          placeholder='Institution Name'
                          maxLength={255}
                          minLength={10}
                          className='placeholder:text-gray-600'
                          value={institution}
                          onChange={event => setInstitution(event.target.value)}
                          disabled={isFormDisabled}
                          required
                      />
                    <FieldDescription></FieldDescription>
                </Field>
                <Field>
                      <FieldLabel htmlFor='start-year-input'>Starting Year</FieldLabel>
                      <Input
                          type='number'
                          name='startYear'
                          id='start-year-input'
                          placeholder='Start Year'
                          min={new Date().getFullYear() - 80}
                          max={new Date().getFullYear() -1}
                          className='placeholder:text-gray-600'
                          value={startYear}
                          onChange={event => setStartYear(event.target.valueAsNumber)}
                          disabled={isFormDisabled}
                          required
                      />
                    <FieldDescription></FieldDescription>
                </Field>
                 <Field>
                      <FieldLabel htmlFor='end-year-input'>Ending Year</FieldLabel>
                      <Input
                          type='number'
                          name='endYear'
                          id='end-year-input'
                          placeholder='End Year'
                          min={new Date().getFullYear() - 80}
                          max={new Date().getFullYear()}
                          className='placeholder:text-gray-600'
                          value={endYear}
                          onChange={event => setEndYear(event.target.valueAsNumber)}
                          disabled={isFormDisabled}
                          required
                      />
                    <FieldDescription></FieldDescription>
                </Field>
                <div className="flex flex-row justify-start itens-center gap-x-2 w-full">
                    <Button variant={'default'} type={'submit'}>Submit</Button>
                    <Button variant={'outline'} type={'reset'}>Reset</Button>
                </div>
            </form>
        </DialogContent>

    </Dialog>
  )
}
