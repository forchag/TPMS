package com.tpms.controller;

import com.tpms.dto.StudentDto;
import com.tpms.mapper.StudentMapper;
import com.tpms.model.Student;
import com.tpms.service.StudentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final StudentService studentService;
    public ProfileController(StudentService ss) { this.studentService = ss; }

    @PreAuthorize("hasRole('ROLE_ADMIN') or (hasRole('ROLE_STUDENT') and #studentId == authentication.name)")
    @GetMapping("/{studentId}")
    public ResponseEntity<StudentDto> getProfile(@PathVariable String studentId) {
        Optional<Student> opt = studentService.getStudentById(studentId);
        return opt.map(StudentMapper::toDto).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') or (hasRole('ROLE_STUDENT') and #studentId == authentication.name)")
    @PutMapping("/{studentId}")
    public ResponseEntity<StudentDto> updateProfile(@PathVariable String studentId,
                                                    @RequestBody StudentDto dto) {
        if (!studentId.equals(dto.getStudentId())) return ResponseEntity.badRequest().build();
        Student updated = studentService.updateStudent(StudentMapper.toModel(dto));
        return ResponseEntity.ok(StudentMapper.toDto(updated));
    }
    
}