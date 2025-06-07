# TPMS

This repository contains the backend API for the Training and Placement Management System.

## Building

The project uses Maven. Static front-end assets under `src/main/resources/static` are packaged into `static.zip` during the build using the Maven Assembly plugin. Run:

```bash
mvn clean package
```

The resulting `static.zip` is created under `tpms-api/target` and is not stored in version control.
