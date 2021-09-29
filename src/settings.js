const settings = {
  date_format: 'DD/MM/YYYY',
  datetime_format: 'DD/MM/YYYY HH:mm:ss',
  textMaxLength: 255,
  phoneCodeMaxLength: 3,
  isoCodeLength: 2,
  genders: {
    options: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
      { text: 'Other', value: 'other' }
    ]
  },
  platforms: {
    options: [
      { text: 'Admin portal', value: 'admin_portal' },
      { text: 'Therapist portal', value: 'therapist_portal' },
      { text: 'Patient app', value: 'patient_app' }
    ]
  },
  contentTypes: {
    options: [
      { text: 'Activities', value: 'activities' },
      { text: 'Preset Treatment', value: 'preset_treatment' }
    ]
  },
  educationMaterial: {
    maxFileSize: 25 // MB
  },
  tinymce: {
    apiKey: 'hp4m52i3gyuf4edxwxu9jyt91br22arfth7bg6ckya5a83k0',
    height: 500,
    plugins: [
      'advlist autolink lists link image code charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    contentStyle: 'body { font-size:14px; }',
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image | code | help'
  },
  minAge: 0,
  maxAge: 80,
  ageGap: 10,
  noteMaxLength: 50
};

export default settings;
