package com.tpms.controller;

import com.tpms.security.JwtTokenProvider;
import com.tpms.service.AuthService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void verifyValidTokenReturnsOk() throws Exception {
        Mockito.when(jwtTokenProvider.validateToken("valid"))
                .thenReturn(true);

        mockMvc.perform(get("/api/auth/verify")
                .header("Authorization", "Bearer valid"))
                .andExpect(status().isOk());
    }

    @Test
    void verifyInvalidTokenReturnsUnauthorized() throws Exception {
        Mockito.when(jwtTokenProvider.validateToken("bad"))
                .thenReturn(false);

        mockMvc.perform(get("/api/auth/verify")
                .header("Authorization", "Bearer bad"))
                .andExpect(status().isUnauthorized());
    }
}
