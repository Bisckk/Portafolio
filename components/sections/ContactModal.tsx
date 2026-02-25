"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(1),
    message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

export function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const t = useTranslations("contact");
    const tv = useTranslations("contact.validation");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(
            z.object({
                name: z.string().min(2, tv("name_min")),
                email: z.string().email(tv("email_invalid")),
                subject: z.string().min(1, tv("subject_required")),
                message: z.string().min(10, tv("message_min")),
            })
        ),
    });

    const onSubmit = async (data: FormData) => {
        setStatus("sending");
        try {
            // EmailJS integration
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

            if (serviceId && templateId && publicKey) {
                const emailjs = await import("@emailjs/browser");
                await emailjs.send(serviceId, templateId, {
                    from_name: data.name,
                    from_email: data.email,
                    subject: data.subject,
                    message: data.message,
                }, publicKey);
            } else {
                // Demo mode: simulate success
                await new Promise((r) => setTimeout(r, 1500));
            }

            setStatus("success");
            reset();
            setTimeout(() => { setStatus("idle"); onClose(); }, 3000);
        } catch {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    const inputCls = `w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm
    placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50
    transition-all duration-200`;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t("modal_title")} size="lg">
            {status === "success" ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle size={32} className="text-green-400" />
                    </div>
                    <p className="text-white font-medium">{t("success")}</p>
                </div>
            ) : status === "error" ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                        <AlertCircle size={32} className="text-red-400" />
                    </div>
                    <p className="text-white/70 text-sm">{t("error")}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                    {/* Name */}
                    <div>
                        <label htmlFor="contact-name" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                            {t("name_label")}
                        </label>
                        <input
                            {...register("name")}
                            id="contact-name"
                            type="text"
                            placeholder={t("name_placeholder")}
                            className={`${inputCls} ${errors.name ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="contact-email" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                            {t("email_label")}
                        </label>
                        <input
                            {...register("email")}
                            id="contact-email"
                            type="email"
                            placeholder={t("email_placeholder")}
                            className={`${inputCls} ${errors.email ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                        <label htmlFor="contact-subject" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                            {t("subject_label")}
                        </label>
                        <input
                            {...register("subject")}
                            id="contact-subject"
                            type="text"
                            placeholder={t("subject_placeholder")}
                            className={`${inputCls} ${errors.subject ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`}
                        />
                        {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
                    </div>

                    {/* Message */}
                    <div>
                        <label htmlFor="contact-message" className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">
                            {t("message_label")}
                        </label>
                        <textarea
                            {...register("message")}
                            id="contact-message"
                            rows={5}
                            placeholder={t("message_placeholder")}
                            className={`${inputCls} resize-none ${errors.message ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`}
                        />
                        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="mt-2 flex items-center justify-center gap-2 px-8 py-3.5
              rounded-full bg-blue-500 hover:bg-blue-400 disabled:opacity-50
              disabled:cursor-not-allowed text-white text-sm font-semibold
              transition-all duration-200 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                        {status === "sending" ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {t("sending")}
                            </>
                        ) : (
                            <>
                                <Send size={15} />
                                {t("submit")}
                            </>
                        )}
                    </button>
                </form>
            )}
        </Modal>
    );
}
