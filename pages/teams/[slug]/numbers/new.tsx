import { Card, InputWithLabel } from '@/components/shared';
import { defaultHeaders } from '@/lib/common';
import { useFormik, FieldArray } from 'formik';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import { createOrUpdateNumberSchema, createOrUpdateNumberSchemaForm } from '@/lib/zod';
import useNumbers from 'hooks/useNumbers';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { z } from 'zod';

const NewNumber = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { t } = useTranslation('common');
  const { mutateNumbers } = useNumbers(slug as string);

  const formik = useFormik<z.infer<typeof createOrUpdateNumberSchemaForm>>({
    initialValues: {
      phoneNumber: '',
      displayName: '',
      language: '',
      emails: '',  // Initialize with one empty email field
    },
    validateOnBlur: false,
    validateOnChange: true,
    validate: (values) => {
      try {
        createOrUpdateNumberSchemaForm.parse(values);
      } catch (error: any) {
        console.log(error);
        console.log(values);
        return error.formErrors.fieldErrors;
      }
    },
    onSubmit: async (values) => {
      // create object createOrUpdateNumberSchema with the sames values but emails as to be 
      const values1 = {
        phoneNumber: values.phoneNumber,
        displayName: values.displayName,
        language: values.language,
        emails: values.emails.split(','),
        };
      console.log(values1);
      const response = await fetch(`/api/teams/${slug}/numbers`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(values1),
      });

      const json = (await response.json()) as ApiResponse<Number>;

      if (!response.ok) {
        toast.error(json.error.message);
        return;
      }

      toast.success(t('successfully-created'));
      mutateNumbers();
      router.push(`/teams/${slug}/numbers`);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <Card.Body>
          <Card.Header>
            <Card.Title>{t('create-number')}</Card.Title>
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
              error={formik.errors.language}
            />
            {/* <FieldArray name="emails">
              {({ push, remove }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('emails')}
                  </label>
                  {formik.values.emails.map((email, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <InputWithLabel
                        name={`emails.${index}`}
                        label={t('email')}
                        value={email}
                        onChange={formik.handleChange}
                        error={formik.errors.emails?.[index]}
                        placeholder={t('email-placeholder')}
                      />
                      <Button
                        type="button"
                        color="error"
                        onClick={() => remove(index)}
                        size="sm"
                      >
                        <FiMinus />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    color="primary"
                    onClick={() => push('')}
                    size="sm"
                  >
                    <FiPlus /> {t('add-email')}
                  </Button>
                </div>
              )}
            </FieldArray> */}
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="flex justify-end">
            <Button
              type="submit"
              color="primary"
              loading={formik.isSubmitting}
            //   disabled={!formik.isValid || !formik.dirty}
            >
              {t('save')}
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </form>
  );
};

export default NewNumber;
