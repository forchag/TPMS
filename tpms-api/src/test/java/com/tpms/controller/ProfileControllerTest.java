package com.tpms.controller;

import com.tpms.model.Student;
import com.tpms.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.context.annotation.Import;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.security.test.context.support.WithMockUser;

@WebMvcTest(ProfileController.class)
@Import(ProfileControllerTest.TestConfig.class)
class ProfileControllerTest {

    @Configuration
    @EnableMethodSecurity
    static class TestConfig {}

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    @Test
    @WithMockUser(username="S001", roles="STUDENT")
    void studentCanAccessOwnProfile() throws Exception {
        when(studentService.getStudentById("S001"))
                .thenReturn(java.util.Optional.of(new Student("S001","John","CS","j@e.com",3.0)));
        mockMvc.perform(get("/api/profile/S001"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username="admin", roles="ADMIN")
    void adminCanAccessAnyProfile() throws Exception {
        when(studentService.getStudentById("S001"))
                .thenReturn(java.util.Optional.of(new Student("S001","John","CS","j@e.com",3.0)));
        mockMvc.perform(get("/api/profile/S001"))
                .andExpect(status().isOk());
    }
}
