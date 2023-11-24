"use client";

import { uploadToS3 } from "@/lib/s3";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "react-query";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"


export const FileUpload = () => {

  const {toast} =  useToast()

  const [uploading, setUploading] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {file_key, file_name});
      return response.data
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {

      const file: File = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        toast({
          description: "File size can't be more than 10Mb",
        })
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);

        if(!data?.file_key || !data.file_name){
          toast({
            description: "Something went wrong please try again!!!",
          })
          return;
        }

        mutate({
          file_key: data.file_key,
          file_name: data.file_name
        },
        {
          onSuccess: (data)=>{
            console.log(data)
          },
          onError: (data)=>{
            console.log(data)
            toast({
              description: "Error creating chat"
            })
          }

        }
        )

      } catch (error) {
        console.log(error);
      }finally{
        setUploading(false)
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT ...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
        </>
        )}
        
      </div>
    </div>
  );
};
