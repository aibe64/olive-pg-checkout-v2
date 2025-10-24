import { Form, FormInstance } from "antd";
import { useState, useEffect } from "react";

const useSubmittable = (form: FormInstance<any>) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    if (form) {
      form?.validateFields({ validateOnly: true }).then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
    }
  }, [form, values]);

  return {
    disabled: !submittable,
  };
};

export default useSubmittable;
