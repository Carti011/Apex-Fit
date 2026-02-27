package com.apexfit.backend;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@TestPropertySource(properties = { "openai.api.key=TEST_KEY" })
class ApexFitBackendApplicationTests {

    @Test
    void contextLoads() {
    }

}
