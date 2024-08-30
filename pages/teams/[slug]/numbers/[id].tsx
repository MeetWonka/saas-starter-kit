import { Card, InputWithLabel } from '@/components/shared';
import { defaultHeaders } from '@/lib/common';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import { createOrUpdateNumberSchema, createOrUpdateNumberSchemaForm } from '@/lib/zod';
import { z } from 'zod';
import useNumber from 'hooks/useNumber';

const EditNumber = () => {
  const router = useRouter();
  const { slug, id } = router.query;
  const { t } = useTranslation('common');
  const { number, mutateNumber } = useNumber(slug as string, id as string);

  const formik = useFormik<z.infer<typeof createOrUpdateNumberSchemaForm>>({
    initialValues: {
      phoneNumber: number?.phoneNumber || '',
      displayName: number?.displayName || '',
      language: number?.language || '',
      emails: number?.emails?.map(email => email.email).join(',') || '',
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validate: (values) => {
      try {
        createOrUpdateNumberSchemaForm.parse(values);
      } catch (error: any) {
        return error.formErrors.fieldErrors;
      }
    },
    onSubmit: async (values) => {
        const values1 = {
            phoneNumber: values.phoneNumber,
            displayName: values.displayName,
            language: values.language,
            emails: values.emails.split(','),
            };
            console.log(values1);
      const response = await fetch(`/api/teams/${slug}/numbers/${id}`, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(values1),
      });

      const json = (await response.json()) as ApiResponse<Number>;

      if (!response.ok) {
        toast.error(json.error.message);
        return;
      }

      toast.success(t('successfully-updated'));
      mutateNumber();
      router.push(`/teams/${slug}/numbers`);
    },
  });

  const handleDelete = async () => {
    const response = await fetch(`/api/teams/${slug}/numbers/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders,
    });

    if (response.ok) {
      toast.success(t('successfully-deleted'));
      router.push(`/teams/${slug}/numbers`);
    } else {
      const json = await response.json();
      toast.error(json.error.message);
    }
  };

  if (!number) {
    return <p>{t('loading')}</p>;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <Card.Body>
          <Card.Header>
            <Card.Title>{t('edit-number')}</Card.Title>
          </Card.Header>
          <div className="flex flex-col gap-4">
            <InputWithLabel
              name="phoneNumber"
              label={t('phone-number')}
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={formik.errors.phoneNumber}
            />
            <InputWithLabel
              name="displayName"
              label={t('display-name')}
              value={formik.values.displayName}
              onChange={formik.handleChange}
              error={formik.errors.displayName}
            />
            <InputWithLabel
              name="language"
              label={t('language')}
              value={formik.values.language}
              onChange={formik.handleChange}
              error={formik.errors.language}
            />
            <InputWithLabel
              name="emails"
              label={t('emails')}
              value={formik.values.emails}
              onChange={formik.handleChange}
              error={formik.errors.emails}
            />
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="flex justify-between">
            <Button
              type="button"
              color="error"
              onClick={handleDelete}
            >
              {t('delete')}
            </Button>
            <Button
              type="submit"
              color="primary"
              loading={formik.isSubmitting}
              disabled={!formik.isValid || !formik.dirty}
            >
              {t('save-changes')}
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </form>
  );
};

export default EditNumber;